import { Injectable } from '@nestjs/common';
import { IPaymentMethodRepository } from '../../../../domain/repositories/payment-method.repository.interface';
import { PaymentMethod } from '../../../../domain/entities/payment-method.entity';
import { CreatePaymentMethodParams, UpdatePaymentMethodParams } from '../../../../utils/type';
import { PrismaService } from '../prisma.service';
import { PaymentMethodMapper } from '../../../mappers/payment-method.mapper';
import { Prisma } from '@prisma/client';
@Injectable()
export class PrismaPaymentMethodRepository implements IPaymentMethodRepository {
  constructor(private prisma: PrismaService) {}

  async findById(id: string): Promise<PaymentMethod | null> {
    const method = await this.prisma.paymentMethod.findUnique({ where: { id } });
    return method ? PaymentMethodMapper.toDomain(method) : null;
  }

  async findAll(): Promise<PaymentMethod[]> {
    const methods = await this.prisma.paymentMethod.findMany();
    return methods.map(PaymentMethodMapper.toDomain);
  }

  async findByUserId(userId: string): Promise<PaymentMethod[]> {
    const methods = await this.prisma.paymentMethod.findMany({ where: { userId } });
    return methods.map(PaymentMethodMapper.toDomain);
  }

  async create(params: CreatePaymentMethodParams): Promise<PaymentMethod> {
    const method = await this.prisma.paymentMethod.create({ data: params as Prisma.PaymentMethodUncheckedCreateInput });
    return PaymentMethodMapper.toDomain(method);
  }

  async update(id: string, params: Partial<UpdatePaymentMethodParams>): Promise<PaymentMethod> {
    const method = await this.prisma.paymentMethod.update({ where: { id }, data: params as Prisma.PaymentMethodUpdateInput });
    return PaymentMethodMapper.toDomain(method);
  }

  async delete(id: string): Promise<void> {
    await this.prisma.paymentMethod.delete({ where: { id } });
  }
}
