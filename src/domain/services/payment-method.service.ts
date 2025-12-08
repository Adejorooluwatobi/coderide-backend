import { Inject, Injectable, Logger } from '@nestjs/common';
import { PaymentMethod } from '../entities/payment-method.entity';
import type { IPaymentMethodRepository } from '../repositories/payment-method.repository.interface';
import { CreatePaymentMethodParams, UpdatePaymentMethodParams } from 'src/utils/type';

@Injectable()
export class PaymentMethodService {
  private readonly logger = new Logger(PaymentMethodService.name);
  constructor(
    @Inject('IPaymentMethodRepository')
    private readonly paymentMethodRepository: IPaymentMethodRepository,
  ) {}

  async findById(id: string): Promise<PaymentMethod | null> { 
    if (!id || typeof id !== 'string') {
      this.logger.warn(`Invalid id provided: ${id}`);
      return null;
    }
    return this.paymentMethodRepository.findById(id);
  }

  async findAll(): Promise<PaymentMethod[]> {
    this.logger.log('Fetching all payment methods');
    return this.paymentMethodRepository.findAll();
  }

  async findByUserId(userId: string): Promise<PaymentMethod[]> {
    if (!userId || typeof userId !== 'string') {
      this.logger.warn(`Invalid userId provided: ${userId}`);
      return [];
    }
    return this.paymentMethodRepository.findByUserId(userId);
  }

  async create(paymentMethod: CreatePaymentMethodParams): Promise<PaymentMethod> {
    this.logger.log(`Creating payment method with data: ${JSON.stringify(paymentMethod)}`);
    return this.paymentMethodRepository.create(paymentMethod);
  }

  async update(id: string, paymentMethod: Partial<UpdatePaymentMethodParams>): Promise<PaymentMethod> {
    if (!id || typeof id !== 'string') {
      this.logger.warn(`Invalid id provided for update: ${id}`);
      throw new Error('Invalid id provided');
    }

    this.logger.log(`Updating payment method ${id} with data: ${JSON.stringify(paymentMethod)}`);
    return this.paymentMethodRepository.update(id, paymentMethod);
  }

  async delete(id: string): Promise<void> {
    if (!id || typeof id !== 'string') {
      this.logger.warn(`Invalid id provided for deletion: ${id}`);
      throw new Error('Invalid id provided');
    }

    await this.paymentMethodRepository.delete(id);
  }
}
