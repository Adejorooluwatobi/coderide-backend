import { Module } from '@nestjs/common';
import { VehicleController } from '../controllers/vehicle.controller';
import { VehicleService } from '../../domain/services/vehicle.service';
import { PrismaModule } from 'src/infrastructure/persistence/prisma/prisma.module';
import { PrismaVehicleRepository } from 'src/infrastructure/persistence/prisma/repositories/prisma.vehicle.repository';

@Module({
  imports: [PrismaModule],
  controllers: [VehicleController],
  providers: [
    VehicleService,
    {
      provide: 'IVehicleRepository',
      useClass: PrismaVehicleRepository,
    },
  ],
  exports: [VehicleService],
})
export class VehicleModule {}
