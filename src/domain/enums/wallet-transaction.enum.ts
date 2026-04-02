export enum TransactionType {
  CREDIT = 'CREDIT',
  DEBIT = 'DEBIT',
}

export enum TransactionCategory {
  DEPOSIT = 'DEPOSIT',
  RIDE_PAYMENT = 'RIDE_PAYMENT',
  DRIVER_EARNING = 'DRIVER_EARNING',
  PLATFORM_FEE = 'PLATFORM_FEE',
  WITHDRAWAL = 'WITHDRAWAL',
  REFUND = 'REFUND',
}

export enum TransactionStatus {
  PENDING = 'PENDING',
  SUCCESS = 'SUCCESS',
  FAILED = 'FAILED',
  REJECTED = 'REJECTED',
}
