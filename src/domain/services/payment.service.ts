import { Inject, Injectable, Logger } from '@nestjs/common';
import { Payment } from '../entities/payment.entity';
import type { IPaymentRepository } from '../repositories/payment.repository.interface';
import { CreatePaymentParams, UpdatePaymentParams } from 'src/utils/type';

@Injectable()
export class PaymentService {
  private readonly logger = new Logger(PaymentService.name);
  constructor(
    @Inject('IPaymentRepository')
    private readonly paymentRepository: IPaymentRepository,
  ) {}

  async findById(id: string): Promise<Payment | null> { 
    if (!id || typeof id !== 'string') {
      this.logger.warn(`Invalid id provided: ${id}`);
      return null;
    }
    return this.paymentRepository.findById(id);
  }

  async findAll(): Promise<Payment[]> {
    this.logger.log('Fetching all payments');
    return this.paymentRepository.findAll();
  }

  async findByRideId(rideId: string): Promise<Payment | null> {
    if (!rideId || typeof rideId !== 'string') {
      this.logger.warn(`Invalid rideId provided: ${rideId}`);
      return null;
    }
    return this.paymentRepository.findByRideId(rideId);
  }

  async findByRiderId(riderId: string): Promise<Payment[]> {
    if (!riderId || typeof riderId !== 'string') {
      this.logger.warn(`Invalid riderId provided: ${riderId}`);
      return [];
    }
    return this.paymentRepository.findByRiderId(riderId);
  }

  async findByTransactionReference(transactionReference: string): Promise<Payment | null> {
    if (!transactionReference || typeof transactionReference !== 'string') {
      this.logger.warn(`Invalid transactionReference provided: ${transactionReference}`);
      return null;
    }
    return this.paymentRepository.findByTransactionReference(transactionReference);
  }

  async create(payment: CreatePaymentParams): Promise<Payment> {
    this.logger.log(`Creating payment with data: ${JSON.stringify(payment)}`);
    return this.paymentRepository.create(payment);
  }

  async update(id: string, payment: Partial<UpdatePaymentParams>): Promise<Payment> {
    if (!id || typeof id !== 'string') {
      this.logger.warn(`Invalid id provided for update: ${id}`);
      throw new Error('Invalid id provided');
    }

    this.logger.log(`Updating payment ${id} with data: ${JSON.stringify(payment)}`);
    return this.paymentRepository.update(id, payment);
  }

  async delete(id: string): Promise<void> {
    if (!id || typeof id !== 'string') {
      this.logger.warn(`Invalid id provided for deletion: ${id}`);
      throw new Error('Invalid id provided');
    }

    await this.paymentRepository.delete(id);
  } 
}
