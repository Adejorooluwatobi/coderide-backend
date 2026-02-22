import { Wallet as PrismaWallet, WalletTransaction as PrismaTransaction } from '@prisma/client';
import { Wallet } from '../../domain/entities/wallet.entity';
import { WalletTransaction } from '../../domain/entities/wallet-transaction.entity';
import { TransactionType, TransactionCategory, TransactionStatus } from '../../domain/enums/wallet-transaction.enum';

export class WalletMapper {
  static toDomain(prismaWallet: PrismaWallet): Wallet {
    return new Wallet({
      id: prismaWallet.id,
      userId: prismaWallet.userId ?? undefined,
      isOrganization: prismaWallet.isOrganization,
      balance: Number(prismaWallet.balance),
      currency: prismaWallet.currency,
      isActive: prismaWallet.isActive,
      createdAt: prismaWallet.createdAt,
      updatedAt: prismaWallet.updatedAt,
    });
  }

  static toTransactionDomain(prismaTransaction: PrismaTransaction): WalletTransaction {
    return new WalletTransaction({
      id: prismaTransaction.id,
      walletId: prismaTransaction.walletId,
      amount: Number(prismaTransaction.amount),
      type: prismaTransaction.type as TransactionType,
      category: prismaTransaction.category as TransactionCategory,
      status: prismaTransaction.status as TransactionStatus,
      reference: prismaTransaction.reference ?? undefined,
      description: prismaTransaction.description ?? undefined,
      createdAt: prismaTransaction.createdAt,
      updatedAt: prismaTransaction.updatedAt,
    });
  }
}
