import { CreatePaymentMethodParams, UpdatePaymentMethodParams } from '../../utils/type';
import { PaymentMethod } from '../entities/payment-method.entity';

export interface IPaymentMethodRepository {
  findById(id: string): Promise<PaymentMethod | null>;
  findAll(): Promise<PaymentMethod[]>;
  findByUserId(userId: string): Promise<PaymentMethod[]>;
  create(paymentMethod: CreatePaymentMethodParams): Promise<PaymentMethod>;
  update(id: string, paymentMethod: Partial<UpdatePaymentMethodParams>): Promise<PaymentMethod>;
  delete(id: string): Promise<void>;
}
