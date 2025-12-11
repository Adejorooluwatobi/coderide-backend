import { Module } from '@nestjs/common';
import { RatingController } from '../controllers/rating.controller';
import { RatingService } from '../../domain/services/rating.service';
import { PrismaModule } from 'src/infrastructure/persistence/prisma/prisma.module';
import { PrismaRatingRepository } from 'src/infrastructure/persistence/prisma/repositories/prisma.rating.repository';

@Module({
  imports: [PrismaModule],
  controllers: [RatingController],
  providers: [
    RatingService,
    {
      provide: 'IRatingRepository',
      useClass: PrismaRatingRepository,
    },
  ],
  exports: [RatingService],
})
export class RatingModule {}
