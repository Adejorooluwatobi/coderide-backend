import { Wallet } from "../entities/wallet.entity";
import { WalletTransaction } from "../entities/wallet-transaction.entity";

export interface IWalletRepository {
    createWallet(userId?: string, isOrganization?: boolean): Promise<Wallet>;
    findByUserId(userId: string): Promise<Wallet | null>;
    findById(id: string): Promise<Wallet | null>;
    getOrganizationWallet(): Promise<Wallet | null>;
    updateBalance(walletId: string, amount: number): Promise<Wallet>;
    createTransaction(data: Partial<WalletTransaction>): Promise<WalletTransaction>;
    updateTransactionStatus(transactionId: string, status: string): Promise<WalletTransaction>;
    getTransactions(walletId: string): Promise<WalletTransaction[]>;
    getTransactionById(id: string): Promise<WalletTransaction | null>;
    getWalletStats(walletId: string, startDate: Date): Promise<{ totalCredit: number, totalDebit: number }>;
}
