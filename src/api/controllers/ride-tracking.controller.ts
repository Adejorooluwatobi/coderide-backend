import { Body, Controller, Delete, Get, Param, Post, Put, ValidationPipe, NotFoundException } from '@nestjs/common';
import { RideTrackingService } from '../../domain/services/ride-tracking.service';
import { ApiOperation } from '@nestjs/swagger';
import { CreateRideTrackingDto } from 'src/application/DTO/ride-tracking/create-ride-tracking.dto';
import { UpdateRideTrackingDto } from 'src/application/DTO/ride-tracking/update-ride-tracking.dto';

@Controller('ride-tracking')
export class RideTrackingController {
  constructor(private readonly rideTrackingService: RideTrackingService) {}

  @Get(':id')
  @ApiOperation({ summary: 'Get ride tracking by ID' })
  async getById(@Param('id') id: string) {
    const tracking = await this.rideTrackingService.findById(id);
    if (!tracking) throw new NotFoundException(`Ride tracking with ID ${id} not found`);
    return { succeeded: true, message: 'Ride tracking retrieved successfully', resultData: tracking };
  }

  @Get()
  @ApiOperation({ summary: 'Get all ride trackings' })
  async getAll() {
    const trackings = await this.rideTrackingService.findAll();
    return { succeeded: true, message: 'Ride trackings retrieved successfully', resultData: trackings };
  }

  @Get('ride/:rideId')
  @ApiOperation({ summary: 'Get tracking points by ride ID' })
  async getByRideId(@Param('rideId') rideId: string) {
    const trackings = await this.rideTrackingService.findByRideId(rideId);
    return { succeeded: true, message: 'Ride trackings retrieved successfully', resultData: trackings };
  }

  @Post()
  @ApiOperation({ summary: 'Create ride tracking' })
  async create(@Body(new ValidationPipe()) data: CreateRideTrackingDto) {
    const tracking = await this.rideTrackingService.create(data);
    return { succeeded: true, message: 'Ride tracking created successfully', resultData: tracking };
  }

  @Put(':id')
  @ApiOperation({ summary: 'Update ride tracking' })
  async update(@Param('id') id: string, @Body(new ValidationPipe()) data: Partial<UpdateRideTrackingDto>) {
    const tracking = await this.rideTrackingService.update(id, data);
    return { succeeded: true, message: 'Ride tracking updated successfully', resultData: tracking };
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Delete ride tracking' })
  async delete(@Param('id') id: string) {
    await this.rideTrackingService.delete(id);
    return { succeeded: true, message: 'Ride tracking deleted successfully' };
  }
}
