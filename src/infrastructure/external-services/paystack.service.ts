import { Injectable, Logger, BadRequestException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import axios from 'axios';

@Injectable()
export class PaystackService {
  private readonly logger = new Logger(PaystackService.name);
  private readonly baseUrl = 'https://api.paystack.co';
  private readonly secretKey: string;

  constructor(private configService: ConfigService) {
    const key = this.configService.get<string>('PAYSTACK_SECRET_KEY');
    const isProd = this.configService.get('NODE_ENV') === 'production';

    if (!key) {
      if (isProd) {
        throw new Error('PAYSTACK_SECRET_KEY is required in production');
      }
      this.logger.warn('PAYSTACK_SECRET_KEY is missing. Using mock key for development.');
      this.secretKey = 'sk_test_mock_key_for_development_purposes_only';
    } else {
      this.secretKey = key;
    }
  }

  private getHeaders() {
    return {
      Authorization: `Bearer ${this.secretKey}`,
      'Content-Type': 'application/json',
    };
  }

  async initializeTransaction(email: string, amount: number, metadata?: any) {
    try {
      this.logger.log(`Initializing Paystack transaction for ${email} with amount ${amount}`);
      
      const response = await axios.post(
        `${this.baseUrl}/transaction/initialize`,
        {
          email,
          amount: amount * 100, // Convert to kobo
          currency: 'NGN',
          metadata,
        },
        { headers: this.getHeaders() }
      );

      return response.data;
    } catch (error) {
      this.logger.error('Paystack initialization error:', error.response?.data || error.message);
      throw new BadRequestException('Failed to initialize payment');
    }
  }

  async verifyTransaction(reference: string) {
    try {
      this.logger.log(`Verifying Paystack transaction: ${reference}`);
      
      const response = await axios.get(
        `${this.baseUrl}/transaction/verify/${reference}`,
        { headers: this.getHeaders() }
      );

      return response.data;
    } catch (error) {
      this.logger.error('Paystack verification error:', error.response?.data || error.message);
      throw new BadRequestException('Failed to verify payment');
    }
  }

  async createTransferRecipient(name: string, accountNumber: string, bankCode: string) {
    try {
      this.logger.log(`Creating Paystack transfer recipient for ${name}`);
      
      const response = await axios.post(
        `${this.baseUrl}/transferrecipient`,
        {
          type: 'nuban',
          name,
          account_number: accountNumber,
          bank_code: bankCode,
          currency: 'NGN',
        },
        { headers: this.getHeaders() }
      );

      return response.data;
    } catch (error) {
      this.logger.error('Paystack recipient creation error:', error.response?.data || error.message);
      throw new BadRequestException('Failed to create transfer recipient');
    }
  }

  async initiateTransfer(amount: number, recipientCode: string, reason: string) {
    try {
      this.logger.log(`Initiating Paystack transfer of ${amount} to ${recipientCode}`);
      
      const response = await axios.post(
        `${this.baseUrl}/transfer`,
        {
          source: 'balance',
          amount: amount * 100, // Convert to kobo
          recipient: recipientCode,
          reason,
        },
        { headers: this.getHeaders() }
      );

      return response.data;
    } catch (error) {
      this.logger.error('Paystack transfer error:', error.response?.data || error.message);
      throw new BadRequestException('Failed to initiate transfer');
    }
  }

  async getBanks() {
    try {
      const response = await axios.get(
        `${this.baseUrl}/bank`,
        { headers: this.getHeaders() }
      );

      return response.data;
    } catch (error) {
      this.logger.error('Paystack banks fetch error:', error.response?.data || error.message);
      throw new BadRequestException('Failed to fetch banks');
    }
  }
}
