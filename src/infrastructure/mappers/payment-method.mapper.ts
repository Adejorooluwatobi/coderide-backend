import { PaymentMethod as PrismaPaymentMethod } from '@prisma/client';
import { PaymentMethod } from '../../domain/entities/payment-method.entity';
import { PaymentGateway, PaymentMethodType } from 'src/domain/enums/payment.enum';

export class PaymentMethodMapper {
  static toDomain(prismaPaymentMethod: PrismaPaymentMethod): PaymentMethod {
    return new PaymentMethod({
      id: prismaPaymentMethod.id,
      userId: prismaPaymentMethod.userId,
      type: prismaPaymentMethod.type as PaymentMethodType,
      cardFirst6: prismaPaymentMethod.cardFirst6 ?? undefined,
      cardLast4: prismaPaymentMethod.cardLast4 ?? undefined,
      cardBrand: prismaPaymentMethod.cardBrand ?? undefined,
      isDefault: prismaPaymentMethod.isDefault,
      paymentGateway: prismaPaymentMethod.paymentGateway as PaymentGateway,
      paymentGatewayToken: prismaPaymentMethod.paymentGatewayToken ?? undefined,
      createdAt: prismaPaymentMethod.createdAt,
      updatedAt: prismaPaymentMethod.updatedAt,
    });
  }

  static toPrisma(paymentMethod: PaymentMethod): Omit<PrismaPaymentMethod, 'createdAt' | 'updatedAt'> {
    return {
      id: paymentMethod.id,
      userId: paymentMethod.userId,
      type: paymentMethod.type,
      cardFirst6: paymentMethod.cardFirst6 ?? null,
      cardLast4: paymentMethod.cardLast4 ?? null,
      cardBrand: paymentMethod.cardBrand ?? null,
      isDefault: paymentMethod.isDefault,
      paymentGateway: paymentMethod.paymentGateway,
      paymentGatewayToken: paymentMethod.paymentGatewayToken ?? null,
    };
  }
}
