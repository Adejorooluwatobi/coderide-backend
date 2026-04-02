import { Injectable } from '@nestjs/common';
import { IWalletRepository } from '../../../../domain/repositories/wallet.repository.interface';
import { Wallet } from '../../../../domain/entities/wallet.entity';
import { WalletTransaction } from '../../../../domain/entities/wallet-transaction.entity';
import { PrismaService } from '../prisma.service';
import { WalletMapper } from '../../../mappers/wallet.mapper';
import { TransactionStatus, TransactionType, TransactionCategory } from '../../../../domain/enums/wallet-transaction.enum';

@Injectable()
export class PrismaWalletRepository implements IWalletRepository {
  constructor(private readonly prisma: PrismaService) {}

  async createWallet(userId?: string, isOrganization: boolean = false): Promise<Wallet> {
    const wallet = await this.prisma.wallet.create({
      data: {
        userId: userId ?? undefined,
        isOrganization,
      },
    });
    return WalletMapper.toDomain(wallet);
  }

  async findByUserId(userId: string): Promise<Wallet | null> {
    const wallet = await this.prisma.wallet.findFirst({
      where: { userId },
    });
    return wallet ? WalletMapper.toDomain(wallet) : null;
  }

  async findById(id: string): Promise<Wallet | null> {
    const wallet = await this.prisma.wallet.findUnique({
      where: { id },
    });
    return wallet ? WalletMapper.toDomain(wallet) : null;
  }

  async getOrganizationWallet(): Promise<Wallet | null> {
    const wallet = await this.prisma.wallet.findFirst({
      where: { isOrganization: true },
    });
    return wallet ? WalletMapper.toDomain(wallet) : null;
  }

  async updateBalance(walletId: string, amount: number): Promise<Wallet> {
    // Note: Concurrency should be handled better, but for now using increment/decrement
    const wallet = await this.prisma.wallet.update({
      where: { id: walletId },
      data: {
        balance: { increment: amount },
      },
    });
    return WalletMapper.toDomain(wallet);
  }

  async createTransaction(data: Partial<WalletTransaction>): Promise<WalletTransaction> {
    const transaction = await this.prisma.walletTransaction.create({
      data: {
        walletId: data.walletId!,
        amount: data.amount!,
        type: data.type! as any, // Cast to Prisma Enum
        category: data.category! as any,
        status: data.status! as any,
        reference: data.reference,
        description: data.description,
      },
    });
    return WalletMapper.toTransactionDomain(transaction);
  }

  async updateTransactionStatus(transactionId: string, status: string): Promise<WalletTransaction> {
    const transaction = await this.prisma.walletTransaction.update({
      where: { id: transactionId },
      data: { status: status as any },
    });
    return WalletMapper.toTransactionDomain(transaction);
  }

  async getTransactions(walletId: string): Promise<WalletTransaction[]> {
    const transactions = await this.prisma.walletTransaction.findMany({
      where: { walletId },
      orderBy: { createdAt: 'desc' },
    });
    return transactions.map(WalletMapper.toTransactionDomain);
  }

  async getTransactionById(id: string): Promise<WalletTransaction | null> {
    const transaction = await this.prisma.walletTransaction.findUnique({
      where: { id },
    });
    return transaction ? WalletMapper.toTransactionDomain(transaction) : null;
  }

  async getWalletStats(walletId: string, startDate: Date): Promise<{ totalCredit: number; totalDebit: number }> {
    const stats = await this.prisma.walletTransaction.groupBy({
      by: ['type'],
      where: {
        walletId,
        status: 'SUCCESS' as any,
        createdAt: {
          gte: startDate,
        },
      },
      _sum: {
        amount: true,
      },
    });

    const result = { totalCredit: 0, totalDebit: 0 };
    stats.forEach((stat) => {
      if (stat.type === ('CREDIT' as any)) {
        result.totalCredit = Number(stat._sum.amount || 0);
      } else if (stat.type === ('DEBIT' as any)) {
        result.totalDebit = Number(stat._sum.amount || 0);
      }
    });

    return result;
  }
}
