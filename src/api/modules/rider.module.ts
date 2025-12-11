import { Module } from '@nestjs/common';
import { RiderController } from '../controllers/rider.controller';
import { RiderService } from '../../domain/services/rider.service';
import { PrismaModule } from 'src/infrastructure/persistence/prisma/prisma.module';
import { PrismaRiderRepository } from 'src/infrastructure/persistence/prisma/repositories/prisma.rider.repository';

@Module({
  imports: [PrismaModule],
  controllers: [RiderController],
  providers: [
    RiderService,
    {
      provide: 'IRiderRepository',
      useClass: PrismaRiderRepository,
    },
  ],
  exports: [RiderService],
})
export class RiderModule {}
