import { Injectable, Logger, BadRequestException, Inject } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import axios from 'axios';
import { IPaymentGatewayLogRepository } from 'src/domain/repositories/payment-gateway-log.repository.interface';
import { PaymentGateway } from 'src/domain/enums/payment.enum';

@Injectable()
export class FlutterwaveService {
  private readonly logger = new Logger(FlutterwaveService.name);
  private readonly baseUrl = 'https://api.flutterwave.com/v3';
  private readonly secretKey: string;
  private readonly publicKey: string;
  private readonly encryptionKey: string;

  constructor(
    private configService: ConfigService,
    @Inject('IPaymentGatewayLogRepository')
    private readonly logRepository: IPaymentGatewayLogRepository,
  ) {
    this.secretKey = this.configService.get<string>('FLUTTERWAVE_SECRET_KEY');
    this.publicKey = this.configService.get<string>('FLUTTERWAVE_PUBLIC_KEY');
    this.encryptionKey = this.configService.get<string>('FLUTTERWAVE_ENCRYPTION_KEY');
    const isProd = this.configService.get('NODE_ENV') === 'production';

    if (!this.secretKey || !this.publicKey) {
      if (isProd) {
        throw new Error('FLUTTERWAVE keys are required in production');
      }
      this.logger.warn('FLUTTERWAVE keys are missing. Using mock keys for development.');
    }
  }

  private getHeaders() {
    return {
      Authorization: `Bearer ${this.secretKey}`,
      'Content-Type': 'application/json',
    };
  }

  private async log(endpoint: string, request: any, response: any, status?: number, ref?: string) {
    try {
      await this.logRepository.create({
        gateway: PaymentGateway.FLUTTERWAVE,
        endpoint,
        requestBody: request,
        responseBody: response,
        statusCode: status,
        transactionRef: ref,
      });
    } catch (e) {
      this.logger.error('Failed to save gateway log', e);
    }
  }

  async initializeTransaction(email: string, amount: number, tx_ref: string, metadata?: any, redirect_url?: string) {
    const endpoint = `${this.baseUrl}/payments`;
    const payload = {
      tx_ref,
      amount,
      currency: 'NGN',
      redirect_url: redirect_url || 'https://example.com/callback', // Placeholder
      customer: {
        email,
      },
      meta: metadata,
      customizations: {
        title: 'Code Ride Payment',
        description: 'Payment for ride service',
        logo: 'https://example.com/logo.png', // Placeholder
      },
    };

    try {
      this.logger.log(`Initializing Flutterwave transaction for ${email} with amount ${amount}`);
      
      const response = await axios.post(
        endpoint,
        payload,
        { headers: this.getHeaders() }
      );

      await this.log(endpoint, payload, response.data, response.status, tx_ref);
      return response.data;
    } catch (error) {
      await this.log(endpoint, payload, error.response?.data, error.response?.status, tx_ref);
      this.logger.error('Flutterwave initialization error:', error.response?.data || error.message);
      throw new BadRequestException('Failed to initialize Flutterwave payment');
    }
  }

  async verifyTransaction(transactionId: string) {
    const endpoint = `${this.baseUrl}/transactions/${transactionId}/verify`;
    try {
      this.logger.log(`Verifying Flutterwave transaction: ${transactionId}`);
      
      const response = await axios.get(
        endpoint,
        { headers: this.getHeaders() }
      );

      await this.log(endpoint, { transactionId }, response.data, response.status, response.data?.data?.tx_ref);
      return response.data;
    } catch (error) {
      await this.log(endpoint, { transactionId }, error.response?.data, error.response?.status);
      this.logger.error('Flutterwave verification error:', error.response?.data || error.message);
      throw new BadRequestException('Failed to verify Flutterwave payment');
    }
  }

  async initiateTransfer(accountNumber: string, bankCode: string, amount: number, reference: string, currency = 'NGN', narration = 'Ride Service Payout') {
    try {
      this.logger.log(`Initiating Flutterwave transfer of ${amount} to ${accountNumber}`);
      
      const response = await axios.post(
        `${this.baseUrl}/transfers`,
        {
          account_bank: bankCode,
          account_number: accountNumber,
          amount,
          currency,
          reference,
          narration,
          callback_url: 'https://example.com/transfer-callback', // Placeholder
        },
        { headers: this.getHeaders() }
      );

      return response.data;
    } catch (error) {
      this.logger.error('Flutterwave transfer error:', error.response?.data || error.message);
      throw new BadRequestException('Failed to initiate Flutterwave transfer');
    }
  }

  async getBanks(country = 'NG') {
    try {
      const response = await axios.get(
        `${this.baseUrl}/banks/${country}`,
        { headers: this.getHeaders() }
      );

      return response.data;
    } catch (error) {
      this.logger.error('Flutterwave banks fetch error:', error.response?.data || error.message);
      throw new BadRequestException('Failed to fetch banks from Flutterwave');
    }
  }
}
