import { Injectable } from '@nestjs/common';
import { IPaymentRepository } from '../../../../domain/repositories/payment.repository.interface';
import { Payment } from '../../../../domain/entities/payment.entity';
import { Prisma } from '@prisma/client';
import { CreatePaymentParams, UpdatePaymentParams } from '../../../../utils/type';
import { PrismaService } from '../prisma.service';
import { PaymentMapper } from '../../../mappers/payment.mapper';

@Injectable()
export class PrismaPaymentRepository implements IPaymentRepository {
  constructor(private prisma: PrismaService) {}

  async findById(id: string): Promise<Payment | null> {
    const payment = await this.prisma.payment.findUnique({ where: { id } });
    return payment ? PaymentMapper.toDomain(payment) : null;
  }

  async findAll(): Promise<Payment[]> {
    const payments = await this.prisma.payment.findMany();
    return payments.map(PaymentMapper.toDomain);
  }

  async findByRideId(rideId: string): Promise<Payment | null> {
    const payment = await this.prisma.payment.findUnique({ where: { rideId } });
    return payment ? PaymentMapper.toDomain(payment) : null;
  }

  async findByRiderId(riderId: string): Promise<Payment[]> {
    const payments = await this.prisma.payment.findMany({ where: { riderId } });
    return payments.map(PaymentMapper.toDomain);
  }

  async findByTransactionReference(transactionReference: string): Promise<Payment | null> {
    const payment = await this.prisma.payment.findUnique({ where: { transactionReference } });
    return payment ? PaymentMapper.toDomain(payment) : null;
  }

  async create(params: CreatePaymentParams): Promise<Payment> {
    const payment = await this.prisma.payment.create({ data: params as Prisma.PaymentUncheckedCreateInput });
    return PaymentMapper.toDomain(payment);
  }

  async update(id: string, params: Partial<UpdatePaymentParams>): Promise<Payment> {
    const payment = await this.prisma.payment.update({ where: { id }, data: params as Prisma.PaymentUpdateInput });
    return PaymentMapper.toDomain(payment);
  }

  async delete(id: string): Promise<void> {
    await this.prisma.payment.delete({ where: { id } });
  }
}
