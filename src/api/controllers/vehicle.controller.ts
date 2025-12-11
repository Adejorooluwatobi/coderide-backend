import { Body, Controller, Delete, Get, Param, Post, Put, ValidationPipe, NotFoundException } from '@nestjs/common';
import { VehicleService } from '../../domain/services/vehicle.service';
import { ApiOperation } from '@nestjs/swagger';
import { CreateVehicleDto } from 'src/application/DTO/vehicle/create-vehicle.dto';
import { UpdateVehicleDto } from 'src/application/DTO/vehicle/update-vehicle.dto';

@Controller('vehicle')
export class VehicleController {
  constructor(private readonly vehicleService: VehicleService) {}

  @Get(':id')
  @ApiOperation({ summary: 'Get vehicle by ID' })
  async getVehicleById(@Param('id') id: string) {
    const vehicle = await this.vehicleService.findById(id);
    if (!vehicle) {
      throw new NotFoundException(`Vehicle with ID ${id} not found`);
    }
    return {
      succeeded: true,
      message: 'Vehicle retrieved successfully',
      resultData: vehicle
    };
  }

  @Get()
  @ApiOperation({ summary: 'Get all vehicles' })
  async getAllVehicles() {
    const vehicles = await this.vehicleService.findAll();
    return {
      succeeded: true,
      message: 'Vehicles retrieved successfully',
      resultData: vehicles
    };
  }

  @Get('license/:licensePlate')
  @ApiOperation({ summary: 'Get vehicle by license plate' })
  async getVehicleByLicensePlate(@Param('licensePlate') licensePlate: string) {
    const vehicle = await this.vehicleService.findByLicensePlate(licensePlate);
    if (!vehicle) {
      throw new NotFoundException(`Vehicle with license plate ${licensePlate} not found`);
    }
    return {
      succeeded: true,
      message: 'Vehicle retrieved successfully',
      resultData: vehicle
    };
  }

  @Get('owner/:ownerId')
  @ApiOperation({ summary: 'Get vehicles by owner ID' })
  async getVehiclesByOwnerId(@Param('ownerId') ownerId: string) {
    const vehicles = await this.vehicleService.findByOwnerId(ownerId);
    return {
      succeeded: true,
      message: 'Vehicles retrieved successfully',
      resultData: vehicles
    };
  }

  @Get('available/company')
  @ApiOperation({ summary: 'Get available company vehicles' })
  async getAvailableCompanyVehicles() {
    const vehicles = await this.vehicleService.findAvailableCompanyVehicles();
    return {
      succeeded: true,
      message: 'Available company vehicles retrieved successfully',
      resultData: vehicles
    };
  }

  @Post()
  @ApiOperation({ summary: 'Create vehicle' })
  async createVehicle(@Body(new ValidationPipe()) vehicleData: CreateVehicleDto) {
    const vehicle = await this.vehicleService.create(vehicleData);
    return {
      succeeded: true,
      message: 'Vehicle created successfully',
      resultData: vehicle
    };
  }

  @Put(':id')
  @ApiOperation({ summary: 'Update vehicle' })
  async updateVehicle(@Param('id') id: string, @Body(new ValidationPipe()) vehicleData: Partial<UpdateVehicleDto>) {
    const vehicle = await this.vehicleService.update(id, vehicleData);
    return {
      succeeded: true,
      message: 'Vehicle updated successfully',
      resultData: vehicle
    };
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Delete vehicle' })
  async deleteVehicle(@Param('id') id: string) {
    await this.vehicleService.delete(id);
    return {
      succeeded: true,
      message: 'Vehicle deleted successfully'
    };
  }
}
