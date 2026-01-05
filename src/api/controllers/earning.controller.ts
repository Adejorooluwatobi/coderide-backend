import { Body, Controller, Delete, Get, Param, Post, Put, ValidationPipe, NotFoundException } from '@nestjs/common';
import { EarningService } from '../../domain/services/earning.service';
import { ApiOperation, ApiResponse } from '@nestjs/swagger';
import { CreateEarningDto } from 'src/application/DTO/earning/create-earning.dto';
import { UpdateEarningDto } from 'src/application/DTO/earning/update-earning.dto';
import { Earning } from 'src/domain/entities/earning.entity';

@Controller('earning')
export class EarningController {
  constructor(private readonly earningService: EarningService) {}

  @Get(':id')
  @ApiOperation({ summary: 'Get earning by ID' })
  @ApiResponse({ status: 200, description: 'Earning retrieved successfully', type: Earning })
  async getById(@Param('id') id: string) {
    const earning = await this.earningService.findById(id);
    if (!earning) throw new NotFoundException(`Earning with ID ${id} not found`);
    return { succeeded: true, message: 'Earning retrieved successfully', resultData: earning };
  }

  @Get()
  @ApiOperation({ summary: 'Get all earnings' })
  @ApiResponse({ status: 200, description: 'Earnings retrieved successfully', type: [Earning] })
  async getAll() {
    const earnings = await this.earningService.findAll();
    return { succeeded: true, message: 'Earnings retrieved successfully', resultData: earnings };
  }

  @Get('ride/:rideId')
  @ApiOperation({ summary: 'Get earning by ride ID' })
  @ApiResponse({ status: 200, description: 'Earning retrieved successfully', type: Earning })
  async getByRideId(@Param('rideId') rideId: string) {
    const earning = await this.earningService.findByRideId(rideId);
    if (!earning) throw new NotFoundException(`Earning for ride ${rideId} not found`);
    return { succeeded: true, message: 'Earning retrieved successfully', resultData: earning };
  }

  @Get('driver/:driverId')
  @ApiOperation({ summary: 'Get earnings by driver ID' })
  @ApiResponse({ status: 200, description: 'Earnings retrieved successfully', type: [Earning] })
  async getByDriverId(@Param('driverId') driverId: string) {
    const earnings = await this.earningService.findByDriverId(driverId);
    return { succeeded: true, message: 'Earnings retrieved successfully', resultData: earnings };
  }

  @Post()
  @ApiOperation({ summary: 'Create earning' })
  @ApiResponse({ status: 201, description: 'Earning created successfully', type: Earning })
  async create(@Body(new ValidationPipe()) data: CreateEarningDto) {
    const earning = await this.earningService.create(data);
    return { succeeded: true, message: 'Earning created successfully', resultData: earning };
  }

  @Put(':id')
  @ApiOperation({ summary: 'Update earning' })
  @ApiResponse({ status: 200, description: 'Earning updated successfully', type: Earning })
  async update(@Param('id') id: string, @Body(new ValidationPipe()) data: Partial<UpdateEarningDto>) {
    const earning = await this.earningService.update(id, data);
    return { succeeded: true, message: 'Earning updated successfully', resultData: earning };
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Delete earning' })
  @ApiResponse({ status: 200, description: 'Earning deleted successfully' })
  async delete(@Param('id') id: string) {
    await this.earningService.delete(id);
    return { succeeded: true, message: 'Earning deleted successfully' };
  }
}
