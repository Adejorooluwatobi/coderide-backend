import {
  IsString,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsEnum,
  Min,
  Max,
} from 'class-validator';
import { RaterType } from 'src/domain/enums/rating.enum';
import { ApiProperty } from '@nestjs/swagger';

export class CreateRatingDto {
  @ApiProperty()
  @IsNotEmpty()
  rideId: string;

  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  raterId: string;

  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  rateeId: string;

  @ApiProperty()
  @IsNumber()
  @IsNotEmpty()
  @Min(1)
  @Max(5)
  rating: number;

  @ApiProperty()
  @IsOptional()
  @IsString()
  comment?: string;

  @ApiProperty()
  @IsEnum(RaterType)
  @IsNotEmpty()
  raterType: RaterType;
}
