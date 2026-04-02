import { Injectable } from '@nestjs/common';
import { IPaymentGatewayLogRepository } from '../../../../domain/repositories/payment-gateway-log.repository.interface';
import { PaymentGatewayLog } from '../../../../domain/entities/payment-gateway-log.entity';
import { PrismaService } from '../prisma.service';
import { PaymentGateway as PrismaPaymentGateway } from '@prisma/client';

@Injectable()
export class PrismaPaymentGatewayLogRepository implements IPaymentGatewayLogRepository {
  constructor(private prisma: PrismaService) {}

  async create(data: Partial<PaymentGatewayLog>): Promise<PaymentGatewayLog> {
    const log = await this.prisma.paymentGatewayLog.create({
      data: {
        gateway: data.gateway as PrismaPaymentGateway,
        endpoint: data.endpoint!,
        requestBody: data.requestBody as any,
        responseBody: data.responseBody as any,
        statusCode: data.statusCode,
        transactionRef: data.transactionRef,
        paymentId: data.paymentId,
      },
    });
    return new PaymentGatewayLog(log as any);
  }

  async findById(id: string): Promise<PaymentGatewayLog | null> {
    const log = await this.prisma.paymentGatewayLog.findUnique({ where: { id } });
    return log ? new PaymentGatewayLog(log as any) : null;
  }

  async findByTransactionRef(transactionRef: string): Promise<PaymentGatewayLog[]> {
    const logs = await this.prisma.paymentGatewayLog.findMany({ where: { transactionRef } });
    return logs.map(log => new PaymentGatewayLog(log as any));
  }

  async findAll(): Promise<PaymentGatewayLog[]> {
    const logs = await this.prisma.paymentGatewayLog.findMany();
    return logs.map(log => new PaymentGatewayLog(log as any));
  }
}
