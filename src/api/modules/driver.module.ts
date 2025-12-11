import { Module } from '@nestjs/common';
import { DriverController } from '../controllers/driver.controller';
import { DriverService } from '../../domain/services/driver.service';
import { PrismaModule } from 'src/infrastructure/persistence/prisma/prisma.module';
import { PrismaDriverRepository } from 'src/infrastructure/persistence/prisma/repositories/prisma.driver.repository';

@Module({
  imports: [PrismaModule],
  controllers: [DriverController],
  providers: [
    DriverService,
    {
      provide: 'IDriverRepository',
      useClass: PrismaDriverRepository,
    },
  ],
  exports: [DriverService],
})
export class DriverModule {}
