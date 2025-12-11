import { Module } from '@nestjs/common';
import { AdminController } from '../controllers/admin.controller';
import { AdminService } from '../../domain/services/admin.service';
import { PrismaModule } from 'src/infrastructure/persistence/prisma/prisma.module';
import { PrismaAdminRepository } from 'src/infrastructure/persistence/prisma/repositories/prisma.admin.repository';

@Module({
  imports: [PrismaModule],
  controllers: [AdminController],
  providers: [
    AdminService,
    {
      provide: 'IAdminRepository',
      useClass: PrismaAdminRepository,
    },
  ],
  exports: [AdminService],
})
export class AdminModule {}
