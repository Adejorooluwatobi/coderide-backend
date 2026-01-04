import { Body, Controller, Delete, Get, Param, Post, Put, ValidationPipe, NotFoundException } from '@nestjs/common';
import { VehicleService } from '../../domain/services/vehicle.service';
import { ApiOperation, ApiResponse } from '@nestjs/swagger';
import { CreateVehicleDto } from 'src/application/DTO/vehicle/create-vehicle.dto';
import { UpdateVehicleDto } from 'src/application/DTO/vehicle/update-vehicle.dto';
import { Vehicle } from 'src/domain/entities/vehicle.entity';

@Controller('vehicle')
export class VehicleController {
  constructor(private readonly vehicleService: VehicleService) {}

  @Get(':id')
  @ApiOperation({ summary: 'Get vehicle by ID' })
  @ApiResponse({ status: 200, description: 'Vehicle retrieved successfully', type: Vehicle })
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
  @ApiResponse({ status: 200, description: 'Vehicles retrieved successfully', type: [Vehicle] })
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
  @ApiResponse({ status: 200, description: 'Vehicle retrieved successfully', type: Vehicle })
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
  @ApiResponse({ status: 200, description: 'Vehicles retrieved successfully', type: [Vehicle] })
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
  @ApiResponse({ status: 200, description: 'Available company vehicles retrieved successfully', type: [Vehicle] })
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
  @ApiResponse({ status: 201, description: 'Vehicle created successfully', type: Vehicle })
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
  @ApiResponse({ status: 200, description: 'Vehicle updated successfully', type: Vehicle })
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
  @ApiResponse({ status: 200, description: 'Vehicle deleted successfully' })
  async deleteVehicle(@Param('id') id: string) {
    await this.vehicleService.delete(id);
    return {
      succeeded: true,
      message: 'Vehicle deleted successfully'
    };
  }
}
