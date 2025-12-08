import { CreatePaymentParams, UpdatePaymentParams } from '../../utils/type';
import { Payment } from '../entities/payment.entity';

export interface IPaymentRepository {
  findById(id: string): Promise<Payment | null>;
  findAll(): Promise<Payment[]>;
  findByRideId(rideId: string): Promise<Payment | null>;
  findByRiderId(riderId: string): Promise<Payment[]>;
  findByTransactionReference(transactionReference: string): Promise<Payment | null>;
  create(payment: CreatePaymentParams): Promise<Payment>;
  update(id: string, payment: Partial<UpdatePaymentParams>): Promise<Payment>;
  delete(id: string): Promise<void>;
}
