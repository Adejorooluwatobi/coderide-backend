import { Injectable, Logger } from '@nestjs/common';

@Injectable()
export class PaystackService {
  private readonly logger = new Logger(PaystackService.name);

  async initializeTransaction(email: string, amount: number) {
    this.logger.log(`Initializing Paystack transaction for ${email} with amount ${amount}`);
    // Mock response
    return {
      status: true,
      message: 'Authorization URL created',
      data: {
        authorization_url: 'https://checkout.paystack.com/mock-transaction-url',
        access_code: 'mock-access-code',
        reference: `ref_${Date.now()}`,
      },
    };
  }

  async verifyTransaction(reference: string) {
    this.logger.log(`Verifying Paystack transaction: ${reference}`);
    // Mock success
    return {
      status: true,
      message: 'Verification successful',
      data: {
        status: 'success',
        reference,
        amount: 500000, // 5000.00
        gateway_response: 'Successful',
      },
    };
  }

  async createTransferRecipient(name: string, accountNumber: string, bankCode: string) {
    this.logger.log(`Creating Paystack transfer recipient for ${name}`);
    return {
      status: true,
      data: {
        recipient_code: `RCP_${Math.random().toString(36).substring(7)}`,
      },
    };
  }

  async initiateTransfer(amount: number, recipientCode: string, reason: string) {
    this.logger.log(`Initiating Paystack transfer of ${amount} to ${recipientCode}`);
    return {
      status: true,
      data: {
        transfer_code: `TRF_${Math.random().toString(36).substring(7)}`,
        status: 'success',
      },
    };
  }
}
