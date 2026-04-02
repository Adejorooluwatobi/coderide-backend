import { Body, Controller, Get, Param, Post, UseGuards, Request, Query } from '@nestjs/common';
import { WalletService } from '../../domain/services/wallet.service';
import { PaymentService } from '../../domain/services/payment.service';
import { ApiOperation, ApiResponse, ApiTags, ApiBearerAuth, ApiQuery } from '@nestjs/swagger';
import { UserGuard } from '../auth/guards/user.guard';
import { PaymentGateway } from 'src/domain/enums/payment.enum';

@ApiTags('Wallet')
@Controller('wallet')
@ApiBearerAuth()
@UseGuards(UserGuard)
export class WalletController {
  constructor(
    private readonly walletService: WalletService,
    private readonly paymentService: PaymentService,
  ) {}

  @Get('balance')
  @ApiOperation({ summary: 'Get wallet balance' })
  async getBalance(@Request() req: any) {
    const userId = req.user.sub;
    return this.walletService.getWallet(userId);
  }

  @Get('transactions')
  @ApiOperation({ summary: 'Get wallet transactions' })
  async getTransactions(@Request() req: any) {
    const userId = req.user.sub;
    return this.walletService.getTransactions(userId);
  }

  @Get('stats')
  @ApiOperation({ summary: 'Get wallet stats (credit/debit)' })
  @ApiQuery({ name: 'period', enum: ['daily', 'weekly', 'monthly', 'yearly'], required: false })
  async getStats(
    @Request() req: any,
    @Query('period') period: string = 'daily'
  ) {
    const userId = req.user.sub;
    return this.walletService.getStats(userId, period);
  }

  @Post('fund')
  @ApiOperation({ summary: 'Fund wallet' })
  @ApiQuery({ name: 'gateway', enum: PaymentGateway, required: false })
  async fundWallet(
    @Request() req: any,
    @Body() body: { amount: number },
    @Query('gateway') gateway: PaymentGateway = PaymentGateway.PAYSTACK
  ) {
    const userId = req.user.sub;
    const email = req.user.email; // Assuming email is in token, otherwise fetch user
    
    // We need to differentiate this payment from a ride payment.
    // Using a dummy rideId or creating a specific method.
    // Let's use a specific reference pattern: "WALLET_FUNDING_{userId}_{timestamp}"
    // And modify PaymentService to handle optional rideId?
    
    // For now, call initializePayment with a dummy rideId or modify PaymentService.
    // I'll modify PaymentService to accept metadata and type.
    
    // Using a hack for now: rideId = "WALLET_FUNDING"
    return this.paymentService.initializePayment(userId, email, body.amount, "WALLET_FUNDING", gateway);
  }

  @Post('withdraw')
  @ApiOperation({ summary: 'Request withdrawal' })
  async requestWithdrawal(
    @Request() req: any,
    @Body() body: { amount: number }
  ) {
    const userId = req.user.sub;
    return this.walletService.requestWithdrawal(userId, body.amount);
  }
}
