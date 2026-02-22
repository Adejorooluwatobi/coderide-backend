import { PaymentGatewayLog } from '../entities/payment-gateway-log.entity';

export interface IPaymentGatewayLogRepository {
  create(log: Partial<PaymentGatewayLog>): Promise<PaymentGatewayLog>;
  findById(id: string): Promise<PaymentGatewayLog | null>;
  findByTransactionRef(transactionRef: string): Promise<PaymentGatewayLog[]>;
  findAll(): Promise<PaymentGatewayLog[]>;
}
