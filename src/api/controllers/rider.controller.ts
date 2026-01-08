import { Body, Controller, Delete, Get, Param, Post, Put, ValidationPipe, NotFoundException, UseGuards } from '@nestjs/common';
import { RiderService } from '../../domain/services/rider.service';
import { ApiOperation, ApiBearerAuth, ApiResponse } from '@nestjs/swagger';
import { CreateRiderDto } from 'src/application/DTO/rider/create-rider.dto';
import { UpdateRiderDto } from 'src/application/DTO/rider/update-rider.dto';
import { UpdateStatusDto } from 'src/application/DTO/common/update-status.dto';
import { UserGuard } from '../auth/guards/user.guard';
import { User } from '../../shared/common/decorators/user.decorator';
import { RiderGuard } from '../auth/guards';
import { Rider } from 'src/domain/entities/rider.entity';

@Controller('rider')
export class RiderController {
  constructor(private readonly riderService: RiderService) {}

  @Get(':id')
  @ApiOperation({ summary: 'Get rider by ID' })
  @ApiResponse({ status: 200, description: 'Rider retrieved successfully', type: Rider })
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
  @ApiResponse({ status: 200, description: 'Riders retrieved successfully', type: [Rider] })
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
  @ApiResponse({ status: 200, description: 'Rider retrieved successfully', type: Rider })
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
  @UseGuards(RiderGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Create rider account using JWT token' })
  @ApiResponse({ status: 201, description: 'Rider created successfully', type: Rider })
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
  @ApiResponse({ status: 200, description: 'Rider updated successfully', type: Rider })
  async updateRider(@Param('id') id: string, @Body(new ValidationPipe()) riderData: Partial<UpdateRiderDto>) {
    const rider = await this.riderService.update(id, riderData);
    return {
      succeeded: true,
      message: 'Rider updated successfully',
      resultData: rider
    };
  }

  @Put(':id/status')
  @ApiOperation({ summary: 'Update rider status' })
  @ApiResponse({ status: 200, description: 'Rider status updated successfully', type: Rider })
  async updateStatus(@Param('id') id: string, @Body(new ValidationPipe()) statusData: UpdateStatusDto) {
    const rider = await this.riderService.updateStatus(id, statusData.status);
    return {
      succeeded: true,
      message: 'Rider status updated successfully',
      resultData: rider
    };
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Delete rider' })
  @ApiResponse({ status: 200, description: 'Rider deleted successfully' })
  async deleteRider(@Param('id') id: string) {
    await this.riderService.delete(id);
    return {
      succeeded: true,
      message: 'Rider deleted successfully'
    };
  }
}
