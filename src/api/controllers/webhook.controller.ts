import { Body, Controller, Post, Headers, Logger, BadRequestException, HttpCode, Inject } from '@nestjs/common';
import { PaymentService } from '../../domain/services/payment.service';
import { WalletService } from '../../domain/services/wallet.service';
import { ConfigService } from '@nestjs/config';
import { ApiTags, ApiOperation } from '@nestjs/swagger';
import { PaymentStatus, PaymentGateway } from '../../domain/enums/payment.enum';
import { IPaymentGatewayLogRepository } from 'src/domain/repositories/payment-gateway-log.repository.interface';
import * as crypto from 'crypto';

@ApiTags('Webhooks')
@Controller('webhooks')
export class WebhookController {
  private readonly logger = new Logger(WebhookController.name);

  constructor(
    private readonly paymentService: PaymentService,
    private readonly walletService: WalletService,
    private readonly configService: ConfigService,
    @Inject('IPaymentGatewayLogRepository')
    private readonly logRepository: IPaymentGatewayLogRepository,
  ) {}

  @Post('paystack')
  @HttpCode(200)
  @ApiOperation({ summary: 'Paystack Webhook' })
  async handlePaystackWebhook(@Body() body: any, @Headers('x-paystack-signature') signature: string) {
    const secret = this.configService.get<string>('PAYSTACK_SECRET_KEY');
    const hash = crypto.createHmac('sha512', secret).update(JSON.stringify(body)).digest('hex');

    await this.logRepository.create({
        gateway: PaymentGateway.PAYSTACK,
        endpoint: 'webhook/paystack',
        requestBody: body,
        responseBody: { signature_valid: hash === signature },
        transactionRef: body.data?.reference,
    });

    if (hash !== signature) {
      this.logger.error('Invalid Paystack signature');
      throw new BadRequestException('Invalid signature');
    }

    this.logger.log(`Received Paystack webhook: ${body.event}`);

    if (body.event === 'charge.success') {
      const { reference, metadata } = body.data;
      
      // Check if this is wallet funding
      if (reference.startsWith('WALLET_FUNDING') || (metadata && metadata.type === 'WALLET_FUNDING')) {
          const userId = metadata?.userId || reference.split('_')[2];
          const amount = body.data.amount / 100;
          await this.walletService.fundWallet(userId, amount, reference);
      } else {
          const payment = await this.paymentService.findByTransactionReference(reference);
          if (payment) {
            await this.paymentService.update(payment.id, { paymentStatus: PaymentStatus.COMPLETED });
          }
      }
    }

    return { received: true };
  }

  @Post('flutterwave')
  @HttpCode(200)
  @ApiOperation({ summary: 'Flutterwave Webhook' })
  async handleFlutterwaveWebhook(@Body() body: any, @Headers('verif-hash') signature: string) {
    const secretHash = this.configService.get<string>('FLUTTERWAVE_SECRET_HASH') || 'MY_SECRET_HASH';
    
    await this.logRepository.create({
        gateway: PaymentGateway.FLUTTERWAVE,
        endpoint: 'webhook/flutterwave',
        requestBody: body,
        responseBody: { signature_valid: signature === secretHash },
        transactionRef: body.data?.tx_ref || body.txRef,
    });

    if (signature !== secretHash) {
       this.logger.error('Invalid Flutterwave signature');
    }

    this.logger.log(`Received Flutterwave webhook: ${body.event || body['event.type']}`);

    const event = body.event || body['event.type'];

    if (event === 'charge.completed') {
      const { tx_ref, status, id, amount, meta } = body.data;
      if (status === 'successful') {
        // Check if this is wallet funding
        if (tx_ref.startsWith('WALLET_FUNDING') || (meta && meta.type === 'WALLET_FUNDING')) {
            const userId = meta?.userId || tx_ref.split('_')[2];
            await this.walletService.fundWallet(userId, Number(amount), tx_ref);
        } else {
            const payment = await this.paymentService.findByTransactionReference(tx_ref);
            if (payment) {
              await this.paymentService.update(payment.id, { paymentStatus: PaymentStatus.COMPLETED });
            }
        }
      }
    }

    return { received: true };
  }
}
