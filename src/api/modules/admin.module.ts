import { Module } from '@nestjs/common';
import { AdminController } from '../controllers/admin.controller';
import { AdminDashboardController } from '../controllers/admin-dashboard.controller';
import { AdminService } from '../../domain/services/admin.service';
import { AdminDashboardService } from '../../domain/services/admin-dashboard.service';
import { PrismaModule } from 'src/infrastructure/persistence/prisma/prisma.module';
import { PrismaAdminRepository } from 'src/infrastructure/persistence/prisma/repositories/prisma.admin.repository';

@Module({
  imports: [PrismaModule],
  controllers: [AdminController, AdminDashboardController],
  providers: [
    AdminService,
    AdminDashboardService,
    {
      provide: 'IAdminRepository',
      useClass: PrismaAdminRepository,
    },
  ],
  exports: [AdminService, AdminDashboardService],
})
export class AdminModule {}
