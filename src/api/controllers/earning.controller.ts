import { Body, Controller, Delete, Get, Param, Post, Put, ValidationPipe, NotFoundException } from '@nestjs/common';
import { EarningService } from '../../domain/services/earning.service';
import { ApiOperation } from '@nestjs/swagger';
import { CreateEarningDto } from 'src/application/DTO/earning/create-earning.dto';
import { UpdateEarningDto } from 'src/application/DTO/earning/update-earning.dto';

@Controller('earning')
export class EarningController {
  constructor(private readonly earningService: EarningService) {}

  @Get(':id')
  @ApiOperation({ summary: 'Get earning by ID' })
  async getById(@Param('id') id: string) {
    const earning = await this.earningService.findById(id);
    if (!earning) throw new NotFoundException(`Earning with ID ${id} not found`);
    return { succeeded: true, message: 'Earning retrieved successfully', resultData: earning };
  }

  @Get()
  @ApiOperation({ summary: 'Get all earnings' })
  async getAll() {
    const earnings = await this.earningService.findAll();
    return { succeeded: true, message: 'Earnings retrieved successfully', resultData: earnings };
  }

  @Get('ride/:rideId')
  @ApiOperation({ summary: 'Get earning by ride ID' })
  async getByRideId(@Param('rideId') rideId: string) {
    const earning = await this.earningService.findByRideId(rideId);
    if (!earning) throw new NotFoundException(`Earning for ride ${rideId} not found`);
    return { succeeded: true, message: 'Earning retrieved successfully', resultData: earning };
  }

  @Get('driver/:driverId')
  @ApiOperation({ summary: 'Get earnings by driver ID' })
  async getByDriverId(@Param('driverId') driverId: string) {
    const earnings = await this.earningService.findByDriverId(driverId);
    return { succeeded: true, message: 'Earnings retrieved successfully', resultData: earnings };
  }

  @Post()
  @ApiOperation({ summary: 'Create earning' })
  async create(@Body(new ValidationPipe()) data: CreateEarningDto) {
    const earning = await this.earningService.create(data);
    return { succeeded: true, message: 'Earning created successfully', resultData: earning };
  }

  @Put(':id')
  @ApiOperation({ summary: 'Update earning' })
  async update(@Param('id') id: string, @Body(new ValidationPipe()) data: Partial<UpdateEarningDto>) {
    const earning = await this.earningService.update(id, data);
    return { succeeded: true, message: 'Earning updated successfully', resultData: earning };
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Delete earning' })
  async delete(@Param('id') id: string) {
    await this.earningService.delete(id);
    return { succeeded: true, message: 'Earning deleted successfully' };
  }
}
