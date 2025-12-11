import { Module } from '@nestjs/common';
import { VehicleAssignmentController } from '../controllers/vehicle-assignment.controller';
import { VehicleAssignmentService } from '../../domain/services/vehicle-assignment.service';
import { PrismaModule } from 'src/infrastructure/persistence/prisma/prisma.module';
import { PrismaVehicleAssignmentRepository } from 'src/infrastructure/persistence/prisma/repositories/prisma.vehicle-assignment.repository';

@Module({
  imports: [PrismaModule],
  controllers: [VehicleAssignmentController],
  providers: [
    VehicleAssignmentService,
    {
      provide: 'IVehicleAssignmentRepository',
      useClass: PrismaVehicleAssignmentRepository,
    },
  ],
  exports: [VehicleAssignmentService],
})
export class VehicleAssignmentModule {}
