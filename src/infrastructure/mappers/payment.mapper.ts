import { Payment as PrismaPayment } from '@prisma/client';
import { Decimal } from '@prisma/client/runtime/library';
import { Payment } from '../../domain/entities/payment.entity';
import { PaymentType, PaymentStatus } from '../../domain/enums/payment.enum';

export class PaymentMapper {
  static toDomain(prismaPayment: PrismaPayment): Payment {
    return new Payment({
      id: prismaPayment.id,
      rideId: prismaPayment.rideId,
      riderId: prismaPayment.riderId,
      amount: Number(prismaPayment.amount),
      paymentMethod: prismaPayment.paymentMethod as PaymentType,
      paymentStatus: prismaPayment.paymentStatus as PaymentStatus,
      transactionReference: prismaPayment.transactionReference ?? undefined,
      paidAt: prismaPayment.paidAt ?? undefined,
      currency: prismaPayment.currency,
      createdAt: prismaPayment.createdAt,
      updatedAt: prismaPayment.updatedAt,
    });
  }

  static toPrisma(payment: Payment): Omit<PrismaPayment, 'createdAt' | 'updatedAt'> {
    return {
      id: payment.id,
      rideId: payment.rideId,
      riderId: payment.riderId,
      amount: new Decimal(payment.amount),
      paymentMethod: payment.paymentMethod,
      paymentStatus: payment.paymentStatus,
      transactionReference: payment.transactionReference ?? null,
      paidAt: payment.paidAt ?? null,
      currency: payment.currency,
    };
  }
}
