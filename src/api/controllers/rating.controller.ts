import { Body, Controller, Delete, Get, Param, Post, Put, ValidationPipe, NotFoundException } from '@nestjs/common';
import { RatingService } from '../../domain/services/rating.service';
import { ApiOperation } from '@nestjs/swagger';
import { CreateRatingDto } from 'src/application/DTO/rating/create-rating.dto';
import { UpdateRatingDto } from 'src/application/DTO/rating/update-rating.dto';

@Controller('rating')
export class RatingController {
  constructor(private readonly ratingService: RatingService) {}

  @Get(':id')
  @ApiOperation({ summary: 'Get rating by ID' })
  async getById(@Param('id') id: string) {
    const rating = await this.ratingService.findById(id);
    if (!rating) throw new NotFoundException(`Rating with ID ${id} not found`);
    return { succeeded: true, message: 'Rating retrieved successfully', resultData: rating };
  }

  @Get()
  @ApiOperation({ summary: 'Get all ratings' })
  async getAll() {
    const ratings = await this.ratingService.findAll();
    return { succeeded: true, message: 'Ratings retrieved successfully', resultData: ratings };
  }

  @Get('ride/:rideId')
  @ApiOperation({ summary: 'Get ratings by ride ID' })
  async getByRideId(@Param('rideId') rideId: string) {
    const ratings = await this.ratingService.findByRideId(rideId);
    return { succeeded: true, message: 'Ratings retrieved successfully', resultData: ratings };
  }

  @Get('ratee/:rateeId')
  @ApiOperation({ summary: 'Get ratings by ratee ID' })
  async getByRateeId(@Param('rateeId') rateeId: string) {
    const ratings = await this.ratingService.findByRateeId(rateeId);
    return { succeeded: true, message: 'Ratings retrieved successfully', resultData: ratings };
  }

  @Post()
  @ApiOperation({ summary: 'Create rating' })
  async create(@Body(new ValidationPipe()) data: CreateRatingDto) {
    const rating = await this.ratingService.create(data as any);
    return { succeeded: true, message: 'Rating created successfully', resultData: rating };
  }

  @Put(':id')
  @ApiOperation({ summary: 'Update rating' })
  async update(@Param('id') id: string, @Body(new ValidationPipe()) data: Partial<UpdateRatingDto>) {
    const rating = await this.ratingService.update(id, data);
    return { succeeded: true, message: 'Rating updated successfully', resultData: rating };
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Delete rating' })
  async delete(@Param('id') id: string) {
    await this.ratingService.delete(id);
    return { succeeded: true, message: 'Rating deleted successfully' };
  }
}
