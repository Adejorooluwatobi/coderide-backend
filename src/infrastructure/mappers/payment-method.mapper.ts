import { PaymentMethod as PrismaPaymentMethod } from '@prisma/client';
import { PaymentMethod } from '../../domain/entities/payment-method.entity';
import { PaymentMethodType } from 'src/domain/enums/payment.enum';

export class PaymentMethodMapper {
  static toDomain(prismaPaymentMethod: PrismaPaymentMethod): PaymentMethod {
    return new PaymentMethod({
      id: prismaPaymentMethod.id,
      userId: prismaPaymentMethod.userId,
      type: prismaPaymentMethod.type as PaymentMethodType,
      cardLast4: prismaPaymentMethod.cardLast4 ?? undefined,
      cardBrand: prismaPaymentMethod.cardBrand ?? undefined,
      isDefault: prismaPaymentMethod.isDefault,
      paymentGatewayToken: prismaPaymentMethod.paymentGatewayToken,
      createdAt: prismaPaymentMethod.createdAt,
      updatedAt: prismaPaymentMethod.updatedAt,
    });
  }

  static toPrisma(paymentMethod: PaymentMethod): Omit<PrismaPaymentMethod, 'createdAt' | 'updatedAt'> {
    return {
      id: paymentMethod.id,
      userId: paymentMethod.userId,
      type: paymentMethod.type,
      cardLast4: paymentMethod.cardLast4 ?? null,
      cardBrand: paymentMethod.cardBrand ?? null,
      isDefault: paymentMethod.isDefault,
      paymentGatewayToken: paymentMethod.paymentGatewayToken,
    };
  }
}
