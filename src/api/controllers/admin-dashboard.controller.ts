import { Controller, Get, Post, Body, Param, UseGuards, ValidationPipe } from '@nestjs/common';
import { AdminDashboardService } from '../../domain/services/admin-dashboard.service';
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';
import { AdminGuard } from '../auth/guards';
import { User } from 'src/shared/common/decorators/user.decorator';
import type { UserPayload } from 'src/shared/interfaces/user-payload.interface';

@ApiTags('Admin Dashboard')
@Controller('admin/dashboard')
@ApiBearerAuth()
@UseGuards(AdminGuard)
export class AdminDashboardController {
  constructor(private readonly dashboardService: AdminDashboardService) {}

  @Get('stats')
  @ApiOperation({ summary: 'Get operational stats for dashboard' })
  async getStats() {
    return this.dashboardService.getStats();
  }

  @Post('tickets/:id/resolve')
  @ApiOperation({ summary: 'Resolve a support ticket' })
  async resolveTicket(
    @Param('id') id: string,
    @Body() body: { resolution: string; comment: string },
    @User() user: UserPayload
  ) {
    return this.dashboardService.resolveTicket(id, body.resolution, body.comment, user.sub);
  }
}
