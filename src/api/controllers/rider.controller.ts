import { Body, Controller, Delete, Get, Param, Post, Put, ValidationPipe, NotFoundException, UseGuards } from '@nestjs/common';
import { RiderService } from '../../domain/services/rider.service';
import { ApiOperation, ApiBearerAuth } from '@nestjs/swagger';
import { CreateRiderDto } from 'src/application/DTO/rider/create-rider.dto';
import { UpdateRiderDto } from 'src/application/DTO/rider/update-rider.dto';
import { UserGuard } from '../auth/guards/user.guard';
import { User } from '../../shared/common/decorators/user.decorator';

@Controller('rider')
export class RiderController {
  constructor(private readonly riderService: RiderService) {}

  @Get(':id')
  @ApiOperation({ summary: 'Get rider by ID' })
  async getRiderById(@Param('id') id: string) {
    const rider = await this.riderService.findById(id);
    if (!rider) {
      throw new NotFoundException(`Rider with ID ${id} not found`);
    }
    return {
      succeeded: true,
      message: 'Rider retrieved successfully',
      resultData: rider
    };
  }

  @Get()
  @ApiOperation({ summary: 'Get all riders' })
  async getAllRiders() {
    const riders = await this.riderService.findAll();
    return {
      succeeded: true,
      message: 'Riders retrieved successfully',
      resultData: riders
    };
  }

  @Get('user/:userId')
  @ApiOperation({ summary: 'Get rider by user ID' })
  async getRiderByUserId(@Param('userId') userId: string) {
    const rider = await this.riderService.findByUserId(userId);
    if (!rider) {
      throw new NotFoundException(`Rider with user ID ${userId} not found`);
    }
    return {
      succeeded: true,
      message: 'Rider retrieved successfully',
      resultData: rider
    };
  }

  @Post()
  @UseGuards(UserGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Create rider account using JWT token' })
  async createRider(@Body(new ValidationPipe()) riderData: CreateRiderDto, @User() user: any) {
    const userId = user.sub;
    const rider = await this.riderService.create({ ...riderData, userId });
    return {
      succeeded: true,
      message: 'Rider created successfully',
      resultData: rider
    };
  }

  @Put(':id')
  @ApiOperation({ summary: 'Update rider' })
  async updateRider(@Param('id') id: string, @Body(new ValidationPipe()) riderData: Partial<UpdateRiderDto>) {
    const rider = await this.riderService.update(id, riderData);
    return {
      succeeded: true,
      message: 'Rider updated successfully',
      resultData: rider
    };
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Delete rider' })
  async deleteRider(@Param('id') id: string) {
    await this.riderService.delete(id);
    return {
      succeeded: true,
      message: 'Rider deleted successfully'
    };
  }
}
