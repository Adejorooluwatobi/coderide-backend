import { Body, Controller, Get, Param, Post, UseGuards, Query } from '@nestjs/common';
import { WalletService } from '../../domain/services/wallet.service';
import { ApiOperation, ApiTags, ApiBearerAuth, ApiQuery } from '@nestjs/swagger';
import { AdminGuard } from '../auth/guards/admin.guard';

@ApiTags('Admin Wallet')
@Controller('admin/wallet')
@ApiBearerAuth()
@UseGuards(AdminGuard)
export class AdminWalletController {
  constructor(private readonly walletService: WalletService) {}

  @Get('organization')
  @ApiOperation({ summary: 'Get organization wallet' })
  async getOrganizationWallet() {
    return this.walletService.getOrganizationWallet();
  }

  @Get('stats')
  @ApiOperation({ summary: 'Get organization wallet stats (credit/debit)' })
  @ApiQuery({ name: 'period', enum: ['daily', 'weekly', 'monthly', 'yearly'], required: false })
  async getStats(@Query('period') period: string = 'daily') {
    return this.walletService.getOrganizationStats(period);
  }

  @Post('withdraw/approve/:transactionId')
  @ApiOperation({ summary: 'Approve withdrawal' })
  async approveWithdrawal(@Param('transactionId') transactionId: string) {
    return this.walletService.approveWithdrawal(transactionId);
  }

  @Post('withdraw/reject/:transactionId')
  @ApiOperation({ summary: 'Reject withdrawal' })
  async rejectWithdrawal(
    @Param('transactionId') transactionId: string,
    @Body('reason') reason: string
  ) {
    return this.walletService.rejectWithdrawal(transactionId, reason || 'Rejected by admin');
  }
}
