import { Module } from '@nestjs/common';
import { DriverScheduleController } from '../controllers/driver-schedule.controller';
import { DriverScheduleService } from '../../domain/services/driver-schedule.service';
import { PrismaModule } from 'src/infrastructure/persistence/prisma/prisma.module';
import { PrismaDriverScheduleRepository } from 'src/infrastructure/persistence/prisma/repositories/prisma.driver-schedule.repository';

@Module({
  imports: [PrismaModule],
  controllers: [DriverScheduleController],
  providers: [
    DriverScheduleService,
    {
      provide: 'IDriverScheduleRepository',
      useClass: PrismaDriverScheduleRepository,
    },
  ],
  exports: [DriverScheduleService],
})
export class DriverScheduleModule {}
