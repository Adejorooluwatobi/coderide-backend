import { Inject, Injectable, Logger, BadRequestException, NotFoundException } from '@nestjs/common';
import type { IWalletRepository } from '../repositories/wallet.repository.interface';
import { Wallet } from '../entities/wallet.entity';
import { WalletTransaction } from '../entities/wallet-transaction.entity';
import { TransactionType, TransactionCategory, TransactionStatus } from '../enums/wallet-transaction.enum';
import { NotificationService } from './notification.service';
import { NotificationType } from '../enums/notification.enum';
import { VehicleOwnership } from '../enums/vehicle-ownership.enum';
import moment from 'moment';

@Injectable()
export class WalletService {
  private readonly logger = new Logger(WalletService.name);

  constructor(
    @Inject('IWalletRepository')
    private readonly walletRepository: IWalletRepository,
    private readonly notificationService: NotificationService,
  ) {}

  async createWallet(userId: string): Promise<Wallet> {
    return this.walletRepository.createWallet(userId, false);
  }

  async getWallet(userId: string): Promise<Wallet> {
    const wallet = await this.walletRepository.findByUserId(userId);
    if (!wallet) throw new NotFoundException('Wallet not found');
    return wallet;
  }

  async getOrganizationWallet(): Promise<Wallet> {
    let wallet = await this.walletRepository.getOrganizationWallet();
    if (!wallet) {
      wallet = await this.walletRepository.createWallet(undefined, true);
    }
    return wallet;
  }

  async getStats(userId: string, period: string = 'daily') {
    const wallet = await this.getWallet(userId);
    const startDate = this.getStartDate(period);
    return this.walletRepository.getWalletStats(wallet.id, startDate);
  }

  async getOrganizationStats(period: string = 'daily') {
    const wallet = await this.getOrganizationWallet();
    const startDate = this.getStartDate(period);
    return this.walletRepository.getWalletStats(wallet.id, startDate);
  }

  private getStartDate(period: string): Date {
    const mDate = moment();
    switch (period.toLowerCase()) {
      case 'daily':
        mDate.startOf('day');
        break;
      case 'weekly':
        mDate.startOf('week');
        break;
      case 'monthly':
        mDate.startOf('month');
        break;
      case 'yearly':
        mDate.startOf('year');
        break;
      default:
        mDate.startOf('day');
    }
    return mDate.toDate();
  }

  async fundWallet(userId: string, amount: number, reference: string): Promise<Wallet> {
    const wallet = await this.getWallet(userId);
    
    await this.walletRepository.createTransaction({
      walletId: wallet.id,
      amount,
      type: TransactionType.CREDIT,
      category: TransactionCategory.DEPOSIT,
      status: TransactionStatus.SUCCESS,
      reference,
      description: 'Wallet funding',
    });

    const updatedWallet = await this.walletRepository.updateBalance(wallet.id, amount);

    await this.notificationService.create({
      userId,
      title: 'Wallet Funded',
      message: `Your wallet has been funded with ${amount} NGN.`,
      type: NotificationType.WALLET_FUNDED,
    });

    return updatedWallet;
  }

  async requestWithdrawal(userId: string, amount: number): Promise<WalletTransaction> {
    const wallet = await this.getWallet(userId);
    if (wallet.balance < amount) throw new BadRequestException('Insufficient balance');

    // Deduct immediately but mark as PENDING withdrawal
    await this.walletRepository.updateBalance(wallet.id, -amount);
    
    const transaction = await this.walletRepository.createTransaction({
      walletId: wallet.id,
      amount,
      type: TransactionType.DEBIT,
      category: TransactionCategory.WITHDRAWAL,
      status: TransactionStatus.PENDING,
      description: 'Withdrawal request',
    });

    // Notify admins (implementation depends on admin notification system)
    // Could emit event here

    return transaction;
  }

  async approveWithdrawal(transactionId: string): Promise<WalletTransaction> {
    const transaction = await this.walletRepository.getTransactionById(transactionId);
    if (!transaction) throw new NotFoundException('Transaction not found');
    if (transaction.status !== TransactionStatus.PENDING) throw new BadRequestException('Transaction not pending');

    const updatedTransaction = await this.walletRepository.updateTransactionStatus(transactionId, TransactionStatus.SUCCESS);

    const wallet = await this.walletRepository.findById(transaction.walletId);
    if (wallet && wallet.userId) {
        await this.notificationService.create({
            userId: wallet.userId,
            title: 'Withdrawal Approved',
            message: `Your withdrawal of ${transaction.amount} NGN has been approved and processed.`,
            type: NotificationType.WITHDRAWAL_UPDATE,
        });
    }

    return updatedTransaction;
  }

  async rejectWithdrawal(transactionId: string, reason: string): Promise<WalletTransaction> {
    const transaction = await this.walletRepository.getTransactionById(transactionId);
    if (!transaction) throw new NotFoundException('Transaction not found');
    if (transaction.status !== TransactionStatus.PENDING) throw new BadRequestException('Transaction not pending');

    // Refund the amount to wallet
    await this.walletRepository.updateBalance(transaction.walletId, transaction.amount);
    
    const updatedTransaction = await this.walletRepository.updateTransactionStatus(transactionId, TransactionStatus.REJECTED);

    const wallet = await this.walletRepository.findById(transaction.walletId);
    if (wallet && wallet.userId) {
        await this.notificationService.create({
            userId: wallet.userId,
            title: 'Withdrawal Rejected',
            message: `Your withdrawal request was rejected: ${reason}`,
            type: NotificationType.WITHDRAWAL_UPDATE,
        });
    }

    return updatedTransaction;
  }

  async processRidePayment(rideId: string, amount: number, riderId: string, driverId: string, ownershipType: VehicleOwnership): Promise<void> {
    const riderWallet = await this.getWallet(riderId);
    const driverWallet = await this.getWallet(driverId);
    const orgWallet = await this.getOrganizationWallet();

    if (riderWallet.balance < amount) {
        throw new BadRequestException('Insufficient rider wallet balance');
    }

    // 1. Charge Rider
    await this.walletRepository.updateBalance(riderWallet.id, -amount);
    await this.walletRepository.createTransaction({
        walletId: riderWallet.id,
        amount,
        type: TransactionType.DEBIT,
        category: TransactionCategory.RIDE_PAYMENT,
        status: TransactionStatus.SUCCESS,
        reference: rideId,
        description: `Payment for ride ${rideId}`,
    });

    // 2. Calculate Split
    // Driver Owned: 30% deducted (70% to driver)
    // Company Owned: 85% deducted (15% to driver)
    let deductionRate = 0.30; 
    if (ownershipType === VehicleOwnership.COMPANY_OWNED) {
        deductionRate = 0.85;
    }

    const platformFee = amount * deductionRate;
    const driverEarnings = amount - platformFee;

    // 3. Credit Driver
    await this.walletRepository.updateBalance(driverWallet.id, driverEarnings);
    await this.walletRepository.createTransaction({
        walletId: driverWallet.id,
        amount: driverEarnings,
        type: TransactionType.CREDIT,
        category: TransactionCategory.DRIVER_EARNING,
        status: TransactionStatus.SUCCESS,
        reference: rideId,
        description: `Earning for ride ${rideId}`,
    });

    // 4. Credit Organization
    await this.walletRepository.updateBalance(orgWallet.id, platformFee);
    await this.walletRepository.createTransaction({
        walletId: orgWallet.id,
        amount: platformFee,
        type: TransactionType.CREDIT,
        category: TransactionCategory.PLATFORM_FEE,
        status: TransactionStatus.SUCCESS,
        reference: rideId,
        description: `Commission for ride ${rideId}`,
    });

    // Notifications
    await this.notificationService.create({
        userId: riderId,
        title: 'Payment Successful',
        message: `You paid ${amount} NGN for your ride via wallet.`,
        type: NotificationType.PAYMENT,
    });

    await this.notificationService.create({
        userId: driverId,
        title: 'Payment Received',
        message: `You received ${driverEarnings} NGN for ride ${rideId}.`,
        type: NotificationType.PAYMENT,
    });
  }

  async getTransactions(userId: string): Promise<WalletTransaction[]> {
    const wallet = await this.getWallet(userId);
    return this.walletRepository.getTransactions(wallet.id);
  }
}
