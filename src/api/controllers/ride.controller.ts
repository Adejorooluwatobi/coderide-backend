import { Body, Controller, Delete, Get, Param, Post, Put, ValidationPipe, NotFoundException } from '@nestjs/common';
import { RideService } from '../../domain/services/ride.service';
import { ApiOperation } from '@nestjs/swagger';
import { CreateRideDto } from 'src/application/DTO/ride/create-ride.dto';
import { UpdateRideDto } from 'src/application/DTO/ride/update-ride.dto';

@Controller('ride')
export class RideController {
  constructor(private readonly rideService: RideService) {}

  @Get(':id')
  @ApiOperation({ summary: 'Get ride by ID' })
  async getRideById(@Param('id') id: string) {
    const ride = await this.rideService.findById(id);
    if (!ride) {
      throw new NotFoundException(`Ride with ID ${id} not found`);
    }
    return { succeeded: true, message: 'Ride retrieved successfully', resultData: ride };
  }

  @Get()
  @ApiOperation({ summary: 'Get all rides' })
  async getAllRides() {
    const rides = await this.rideService.findAll();
    return { succeeded: true, message: 'Rides retrieved successfully', resultData: rides };
  }

  @Get('rider/:riderId')
  @ApiOperation({ summary: 'Get rides by rider ID' })
  async getRidesByRiderId(@Param('riderId') riderId: string) {
    const rides = await this.rideService.findByRiderId(riderId);
    return { succeeded: true, message: 'Rides retrieved successfully', resultData: rides };
  }

  @Get('driver/:driverId')
  @ApiOperation({ summary: 'Get rides by driver ID' })
  async getRidesByDriverId(@Param('driverId') driverId: string) {
    const rides = await this.rideService.findByDriverId(driverId);
    return { succeeded: true, message: 'Rides retrieved successfully', resultData: rides };
  }

  @Get('status/:status')
  @ApiOperation({ summary: 'Get rides by status' })
  async getRidesByStatus(@Param('status') status: string) {
    const rides = await this.rideService.findByStatus(status);
    return { succeeded: true, message: 'Rides retrieved successfully', resultData: rides };
  }

  @Post()
  @ApiOperation({ summary: 'Create ride' })
  async createRide(@Body(new ValidationPipe()) rideData: CreateRideDto) {
    const ride = await this.rideService.create(rideData as any);
    return { succeeded: true, message: 'Ride created successfully', resultData: ride };
  }

  @Put(':id')
  @ApiOperation({ summary: 'Update ride' })
  async updateRide(@Param('id') id: string, @Body(new ValidationPipe()) rideData: Partial<UpdateRideDto>) {
    const ride = await this.rideService.update(id, rideData);
    return { succeeded: true, message: 'Ride updated successfully', resultData: ride };
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Delete ride' })
  async deleteRide(@Param('id') id: string) {
    await this.rideService.delete(id);
    return { succeeded: true, message: 'Ride deleted successfully' };
  }
}
