import { Injectable, Logger } from '@nestjs/common';
import { PrismaService } from 'src/infrastructure/persistence/prisma/prisma.service';
import { RideStatus, TicketStatus } from '@prisma/client';

@Injectable()
export class AdminDashboardService {
  private readonly logger = new Logger(AdminDashboardService.name);
  constructor(private prisma: PrismaService) {}

  async getStats() {
    this.logger.log('Fetching admin dashboard stats');
    
    const [
        totalRevenue,
        totalRides,
        activeDrivers,
        openTickets,
        completedRides,
    ] = await Promise.all([
        this.prisma.earning.aggregate({
            _sum: { grossAmount: true }
        }),
        this.prisma.ride.count(),
        this.prisma.driver.count({ where: { isOnline: true } }),
        this.prisma.supportTicket.count({ where: { status: TicketStatus.OPEN } }),
        this.prisma.ride.count({ where: { status: RideStatus.COMPLETED } }),
    ]);

    const completionRate = totalRides > 0 ? (completedRides / totalRides) * 100 : 0;

    return {
        totalRevenue: Number(totalRevenue._sum.grossAmount || 0),
        totalRides,
        activeDrivers,
        openTickets,
        completionRate: Math.round(completionRate * 100) / 100,
    };
  }

  async resolveTicket(ticketId: string, resolution: string, adminComment: string, adminId: string) {
    this.logger.log(`Resolving ticket ${ticketId} by admin ${adminId}`);
    
    return this.prisma.supportTicket.update({
        where: { id: ticketId },
        data: {
            status: TicketStatus.RESOLVED,
            adminId,
            resolvedAt: new Date(),
            // subject: Use subject or description or add resolution field if needed
            // For now, let's just append resolution to description or assume there's a comment system
        }
    });
  }
}
