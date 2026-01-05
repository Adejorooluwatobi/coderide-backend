import { Inject, Injectable, Logger, BadRequestException } from '@nestjs/common';
import { Payout } from '../entities/payout.entity';
import type { IPayoutRepository } from '../repositories/payout.repository.interface';
import { CreatePayoutParams, UpdatePayoutParams } from 'src/utils/type';
import { PaystackService } from 'src/infrastructure/external-services/paystack.service';
import type { IEarningRepository } from '../repositories/earning.repository.interface';
import { PayoutStatus } from '../enums/payout-status.enum';
import type { IDriverRepository } from '../repositories/driver.repository.interface';

@Injectable()
export class PayoutService {
  private readonly logger = new Logger(PayoutService.name);
  constructor(
    @Inject('IPayoutRepository')
    private readonly payoutRepository: IPayoutRepository,
    @Inject('IEarningRepository')
    private readonly earningRepository: IEarningRepository,
    @Inject('IDriverRepository')
    private readonly driverRepository: IDriverRepository,
    private readonly paystackService: PaystackService,
  ) {}

  async requestPayout(driverId: string): Promise<Payout> {
    this.logger.log(`Payout request for driver ${driverId}`);
    
    // 1. Find all PENDING earnings
    const earnings = await this.earningRepository.findByDriverId(driverId);
    const pendingEarnings = earnings.filter(e => e.payoutStatus === PayoutStatus.PENDING);
    
    if (pendingEarnings.length === 0) {
        throw new BadRequestException('No pending earnings available for payout');
    }

    const totalAmount = pendingEarnings.reduce((sum, e) => sum + Number(e.netAmount), 0);

    // 2. Fetch driver bank details
    const driver = await this.driverRepository.findById(driverId);
    if (!driver || !driver.bankAccountDetails) {
        throw new BadRequestException('Driver bank account details are missing');
    }

    const bankDetails = driver.bankAccountDetails as any;

    try {
        // 3. Create Paystack Transfer Recipient
        const recipientResponse = await this.paystackService.createTransferRecipient(
            bankDetails.accountName,
            bankDetails.accountNumber,
            bankDetails.bankCode
        );

        if (!recipientResponse.status) {
            throw new Error('Failed to create Paystack recipient');
        }

        // 4. Initiate Paystack Transfer
        const transferResponse = await this.paystackService.initiateTransfer(
            totalAmount * 100, // in kobo
            recipientResponse.data.recipient_code,
            `Payout for driver ${driverId}`
        );

        if (!transferResponse.status) {
            throw new Error('Paystack transfer initiation failed');
        }

        // 5. Create Payout record
        const payout = await this.payoutRepository.create({
            driverId,
            amount: totalAmount,
            status: PayoutStatus.PAID, // Since it's a mock/auto-success for now
            transferReference: transferResponse.data.transfer_code,
        });

        // 6. Update Earning records
        for (const earning of pendingEarnings) {
            await this.earningRepository.update(earning.id, {
                payoutStatus: PayoutStatus.PAID,
                payoutId: payout.id,
                paidOutAt: new Date(),
            } as any);
        }

        return payout;

    } catch (error) {
        this.logger.error(`Payout failed: ${error.message}`);
        throw new BadRequestException(`Payout failed: ${error.message}`);
    }
  }

  async findById(id: string): Promise<Payout | null> {
    return this.payoutRepository.findById(id);
  }

  async findAll(): Promise<Payout[]> {
    return this.payoutRepository.findAll();
  }

  async findByDriverId(driverId: string): Promise<Payout[]> {
    return this.payoutRepository.findByDriverId(driverId);
  }
}
