import { Body, Controller, Delete, Get, Param, Post, Put, ValidationPipe, NotFoundException, UseGuards, Logger, BadRequestException } from '@nestjs/common';
import { RideService } from '../../domain/services/ride.service';
import { DriverService } from '../../domain/services/driver.service';
import { ApiOperation, ApiBearerAuth, ApiResponse } from '@nestjs/swagger';
import { CreateRideDto } from 'src/application/DTO/ride/create-ride.dto';
import { UpdateRideDto } from 'src/application/DTO/ride/update-ride.dto';
import { Ride } from 'src/domain/entities/ride.entity';
import { AdminGuard, DriverGuard, RiderGuard, UserGuard } from '../auth/guards';
import { User } from 'src/shared/common/decorators/user.decorator';
import { RiderService } from 'src/domain/services/rider.service';
import { RideStatus } from '@prisma/client';
import type { UserPayload } from 'src/shared/interfaces/user-payload.interface';

@Controller('ride')
export class RideController {
  private readonly logger = new Logger(RideController.name);

  constructor(
    private readonly rideService: RideService,
    private readonly riderService: RiderService,
    private readonly driverService: DriverService,
  ) {}

  @Get(':id')
  @UseGuards(UserGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Get ride by ID' })
  @ApiResponse({ status: 200, description: 'Ride retrieved successfully', type: Ride })
  async getRideById(@Param('id') id: string, @User() user: UserPayload) {
    const ride = await this.rideService.findById(id);
    if (!ride) {
      throw new NotFoundException(`Ride with ID ${id} not found`);
    }

    // Access Control
    let isAllowed = false;
    if (user.role === 'ADMIN') {
      isAllowed = true;
    } else if (user.role === 'RIDER') {
      const rider = await this.riderService.findByUserId(user.sub);
      if (rider && ride.riderId === rider.id) {
        isAllowed = true;
      }
    } else if (user.role === 'DRIVER') {
      const driver = await this.driverService.findByUserId(user.sub);
      if (driver && ride.driverId === driver.id) {
        isAllowed = true;
      }
    }

    if (!isAllowed) {
      throw new NotFoundException(`Ride with ID ${id} not found or access denied`);
    }

    return { succeeded: true, message: 'Ride retrieved successfully', resultData: ride };
  }

  @Get()
  @UseGuards(AdminGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Get all rides' })
  @ApiResponse({ status: 200, description: 'Rides retrieved successfully', type: [Ride] })
  async getAllRides() {
    const rides = await this.rideService.findAll();
    return { succeeded: true, message: 'Rides retrieved successfully', resultData: rides };
  }

  @Get('rider/me')
  @UseGuards(RiderGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Get rides for logged-in rider' })
  @ApiResponse({ status: 200, description: 'Rides retrieved successfully', type: [Ride] })
  async getMyRiderRides(@User() user: UserPayload) {
    const rider = await this.riderService.findByUserId(user.sub);
    if (!rider) {
      throw new NotFoundException('Rider profile not found');
    }
    const rides = await this.rideService.findByRiderId(rider.id);
    return { succeeded: true, message: 'Rides retrieved successfully', resultData: rides };
  }

  @Get('driver/me')
  @UseGuards(DriverGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Get rides for logged-in driver' })
  @ApiResponse({ status: 200, description: 'Rides retrieved successfully', type: [Ride] })
  async getMyDriverRides(@User() user: UserPayload) {
    const driver = await this.driverService.findByUserId(user.sub);
    if (!driver) {
      throw new NotFoundException('Driver profile not found');
    }
    const rides = await this.rideService.findByDriverId(driver.id);
    return { succeeded: true, message: 'Rides retrieved successfully', resultData: rides };
  }

  @Get('status/:status')
  @ApiOperation({ summary: 'Get rides by status' })
  @ApiResponse({ status: 200, description: 'Rides retrieved successfully', type: [Ride] })
  async getRidesByStatus(@Param('status') status: string) {
    const rides = await this.rideService.findByStatus(status);
    return { succeeded: true, message: 'Rides retrieved successfully', resultData: rides };
  }

  @Post()
  @UseGuards(UserGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Create ride' })
  @ApiResponse({ status: 201, description: 'Ride created successfully', type: Ride })
  async createRide(@Body(new ValidationPipe()) rideData: CreateRideDto, @User() user: UserPayload) {
    const rider = await this.riderService.findByUserId(user.sub);
    if (!rider) {
      throw new NotFoundException(`Rider for user ${user.sub} not found`);
    }
    const ride = await this.rideService.requestRide(
      rider.id,
      rideData.pickupLatitude,
      rideData.pickupLongitude,
      rideData.destinationLatitude,
      rideData.destinationLongitude,
      rideData.rideType
    );
    return ride;
  }

  @Put(':id')
  @UseGuards(RiderGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Update ride' })
  @ApiResponse({ status: 200, description: 'Ride updated successfully', type: Ride })
  async updateRide(@Param('id') id: string, @Body(new ValidationPipe()) rideData: Partial<UpdateRideDto>) {
    const ride = await this.rideService.update(id, rideData);
    return { succeeded: true, message: 'Ride updated successfully', resultData: ride };
  }

  @Put(':id/status')
  @UseGuards(DriverGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Update ride status' })
  @ApiResponse({ status: 200, description: 'Ride status updated successfully', type: Ride })
  async updateRideStatus(@Param('id') id: string, @Body(new ValidationPipe()) rideData: UpdateRideDto, @User() user: UserPayload) {
    this.logger.log(`updateRideStatus called for id: ${id}`);
    
    // access control: only the assigned driver can update status
    const driver = await this.driverService.findByUserId(user.sub);
    if (!driver) {
      throw new NotFoundException('Driver profile not found');
    }

    const ride = await this.rideService.findById(id);
    if (!ride) {
      throw new NotFoundException('Ride not found');
    }

    if (ride.driverId !== driver.id) {
       throw new NotFoundException('Ride not found or access denied');
    }

    if (!rideData.status) {
       throw new BadRequestException('Status is required');
    }
    
    this.logger.log(`Payload received: ${JSON.stringify(rideData)}`);
    this.logger.log(`Status to update: ${rideData.status}`);
    
    const updatedRide = await this.rideService.updateStatus(id, rideData.status as RideStatus);
    return { succeeded: true, message: 'Ride status updated successfully', resultData: updatedRide };
  }

  @Delete(':id')
  @UseGuards(RiderGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Delete ride' })
  @ApiResponse({ status: 200, description: 'Ride deleted successfully' })
  async deleteRide(@Param('id') id: string) {
    await this.rideService.delete(id);
    return { succeeded: true, message: 'Ride deleted successfully' };
  }
}
