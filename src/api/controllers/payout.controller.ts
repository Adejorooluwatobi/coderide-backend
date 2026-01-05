import { Controller, Post, Get, Param, UseGuards, Request } from '@nestjs/common';
import { PayoutService } from '../../domain/services/payout.service';
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';
import { DriverGuard } from '../auth/guards';
import { User } from 'src/shared/common/decorators/user.decorator';
import { DriverService } from '../../domain/services/driver.service';
import type { UserPayload } from 'src/shared/interfaces/user-payload.interface';

@ApiTags('Payouts')
@Controller('payouts')
@ApiBearerAuth()
@UseGuards(DriverGuard)
export class PayoutController {
  constructor(
    private readonly payoutService: PayoutService,
    private readonly driverService: DriverService
  ) {}

  @Post('request')
  @ApiOperation({ summary: 'Request payout for accumulated earnings' })
  async requestPayout(@User() user: UserPayload) {
    const driver = await this.driverService.findByUserId(user.sub);
    if (!driver) {
        throw new Error('Driver profile not found');
    }
    return this.payoutService.requestPayout(driver.id);
  }

  @Get('history')
  @ApiOperation({ summary: 'Get payout history for current driver' })
  async getPayoutHistory(@User() user: UserPayload) {
    const driver = await this.driverService.findByUserId(user.sub);
    if (!driver) {
        throw new Error('Driver profile not found');
    }
    return this.payoutService.findByDriverId(driver.id);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get payout details' })
  async getPayoutDetails(@Param('id') id: string) {
    return this.payoutService.findById(id);
  }
}
