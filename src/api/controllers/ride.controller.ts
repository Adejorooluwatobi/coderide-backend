import { Body, Controller, Delete, Get, Param, Post, Put, ValidationPipe, NotFoundException, UseGuards } from '@nestjs/common';
import { RideService } from '../../domain/services/ride.service';
import { ApiOperation, ApiBearerAuth } from '@nestjs/swagger';
import { CreateRideDto } from 'src/application/DTO/ride/create-ride.dto';
import { UpdateRideDto } from 'src/application/DTO/ride/update-ride.dto';
import { Ride } from 'src/domain/entities/ride.entity';
import { AdminGuard, DriverGuard, RiderGuard, UserGuard } from '../auth/guards';
import { User } from 'src/shared/common/decorators/user.decorator';
import { RiderService } from 'src/domain/services/rider.service';
import { RideStatus } from '@prisma/client';

@Controller('ride')
export class RideController {
  constructor(
    private readonly rideService: RideService,
    private readonly riderService: RiderService,
  ) {}

  @Get(':id')
  @UseGuards(AdminGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Get ride by ID' })
  async getRideById(@Param('id') id: string) {
    const ride = await this.rideService.findById(id);
    if (!ride) {
      throw new NotFoundException(`Ride with ID ${id} not found`);
    }
    return { succeeded: true, message: 'Ride retrieved successfully', resultData: ride };
  }

  @Get()
  @UseGuards(AdminGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Get all rides' })
  async getAllRides() {
    const rides = await this.rideService.findAll();
    return { succeeded: true, message: 'Rides retrieved successfully', resultData: rides };
  }

  @Get('rider/:riderId')
  @UseGuards(AdminGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Get rides by rider ID' })
  async getRidesByRiderId(@Param('riderId') riderId: string) {
    const rides = await this.rideService.findByRiderId(riderId);
    return { succeeded: true, message: 'Rides retrieved successfully', resultData: rides };
  }

  @Get('driver/:driverId')
  @UseGuards(AdminGuard)
  @ApiBearerAuth()
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
  @UseGuards(UserGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Create ride' })
  async createRide(@Body(new ValidationPipe()) rideData: CreateRideDto, @User() user: any) {
    const rider = await this.riderService.findByUserId(user.sub);
    if (!rider) {
      throw new NotFoundException(`Rider for user ${user.sub} not found`);
    }
    const ride = await this.rideService.create({ ...rideData, riderId: rider.id } as Ride);
    return { succeeded: true, message: 'Ride created successfully', resultData: ride };
  }

  @Put(':id')
  @UseGuards(RiderGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Update ride' })
  async updateRide(@Param('id') id: string, @Body(new ValidationPipe()) rideData: Partial<UpdateRideDto>) {
    const ride = await this.rideService.update(id, rideData);
    return { succeeded: true, message: 'Ride updated successfully', resultData: ride };
  }

  @Put('status/:id')
  @UseGuards(DriverGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Update ride status' })
  async updateRideStatus(@Param('id') id: string, @Body(new ValidationPipe()) rideData: Partial<UpdateRideDto>) {
    const ride = await this.rideService.updateStatus(id, rideData.status as RideStatus);
    return { succeeded: true, message: 'Ride status updated successfully', resultData: ride };
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Delete ride' })
  async deleteRide(@Param('id') id: string) {
    await this.rideService.delete(id);
    return { succeeded: true, message: 'Ride deleted successfully' };
  }
}
