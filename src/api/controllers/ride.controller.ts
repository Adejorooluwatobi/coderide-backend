import { Body, Controller, Delete, Get, Param, Post, Put, ValidationPipe, NotFoundException, UseGuards } from '@nestjs/common';
import { RideService } from '../../domain/services/ride.service';
import { DriverService } from '../../domain/services/driver.service';
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
    private readonly driverService: DriverService,
  ) {}

  @Get(':id')
  @UseGuards(UserGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Get ride by ID' })
  async getRideById(@Param('id') id: string, @User() user: any) {
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
  async getAllRides() {
    const rides = await this.rideService.findAll();
    return { succeeded: true, message: 'Rides retrieved successfully', resultData: rides };
  }

  @Get('rider/me')
  @UseGuards(RiderGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Get rides for logged-in rider' })
  async getMyRiderRides(@User() user: any) {
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
  async getMyDriverRides(@User() user: any) {
    const driver = await this.driverService.findByUserId(user.sub);
    if (!driver) {
      throw new NotFoundException('Driver profile not found');
    }
    const rides = await this.rideService.findByDriverId(driver.id);
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

  async updateRideStatus(@Param('id') id: string, @Body(new ValidationPipe()) rideData: Partial<UpdateRideDto> | string, @User() user: any) {
    console.log(`[RideController] updateRideStatus called for id: ${id}`);
    
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

    let parsedData: Partial<UpdateRideDto>;
    if (typeof rideData === 'string') {
      console.log('[RideController] rideData is a string, parsing...');
      try {
        parsedData = JSON.parse(rideData);
      } catch (error) {
        throw new Error('Invalid JSON body');
      }
    } else {
      parsedData = rideData;
    }
    
    console.log(`[RideController] Payload received: ${JSON.stringify(parsedData)}`);
    console.log(`[RideController] Status to update: ${parsedData.status}`);
    
    const updatedRide = await this.rideService.updateStatus(id, parsedData.status as RideStatus);
    return { succeeded: true, message: 'Ride status updated successfully', resultData: updatedRide };
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Delete ride' })
  async deleteRide(@Param('id') id: string) {
    await this.rideService.delete(id);
    return { succeeded: true, message: 'Ride deleted successfully' };
  }
}
