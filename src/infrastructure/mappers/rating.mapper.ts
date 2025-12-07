import { Rating as PrismaRating } from '@prisma/client';
import { Rating } from '../../domain/entities/rating.entity';
import { RaterType } from 'src/domain/enums/rating.enum';

export class RatingMapper {
  static toDomain(prismaRating: PrismaRating): Rating {
    return new Rating({
      id: prismaRating.id,
      rideId: prismaRating.rideId,
      raterId: prismaRating.raterId,
      rateeId: prismaRating.rateeId,
      rating: prismaRating.rating,
      comment: prismaRating.comment ?? undefined,
      raterType: prismaRating.raterType as RaterType,
      createdAt: prismaRating.createdAt,
    });
  }

  static toPrisma(rating: Rating): Omit<PrismaRating, 'id' | 'createdAt'> {
    return {
      rideId: rating.rideId,
      raterId: rating.raterId,
      rateeId: rating.rateeId,
      rating: rating.rating,
      comment: rating.comment ?? null,
      raterType: rating.raterType,
    };
  }
}
