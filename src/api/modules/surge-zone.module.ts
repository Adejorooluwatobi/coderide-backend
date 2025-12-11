import { Module } from '@nestjs/common';
import { SurgeZoneController } from '../controllers/surge-zone.controller';
import { SurgeZoneService } from '../../domain/services/surge-zone.service';
import { PrismaModule } from 'src/infrastructure/persistence/prisma/prisma.module';
import { PrismaSurgeZoneRepository } from 'src/infrastructure/persistence/prisma/repositories/prisma.surge-zone.repository';

@Module({
  imports: [PrismaModule],
  controllers: [SurgeZoneController],
  providers: [
    SurgeZoneService,
    {
      provide: 'ISurgeZoneRepository',
      useClass: PrismaSurgeZoneRepository,
    },
  ],
  exports: [SurgeZoneService],
})
export class SurgeZoneModule {}
