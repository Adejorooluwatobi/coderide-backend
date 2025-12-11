import { Body, Controller, Delete, Get, Param, Post, Put, ValidationPipe, NotFoundException } from '@nestjs/common';
import { DriverService } from '../../domain/services/driver.service';
import { ApiOperation } from '@nestjs/swagger';
import { CreateDriverApplicationDto } from 'src/application/DTO/driver/create-driver-application.dto';
import { CreateCompanyDriverDto } from 'src/application/DTO/driver/create-company-driver.dto';
import { UpdateDriverDto } from 'src/application/DTO/driver/update-driver.dto';

@Controller('driver')
export class DriverController {
  constructor(private readonly driverService: DriverService) {}

  @Get(':id')
  @ApiOperation({ summary: 'Get driver by ID' })
  async getDriverById(@Param('id') id: string) {
    const driver = await this.driverService.findById(id);
    if (!driver) {
      throw new NotFoundException(`Driver with ID ${id} not found`);
    }
    return {
      succeeded: true,
      message: 'Driver retrieved successfully',
      resultData: driver
    };
  }

  @Get()
  @ApiOperation({ summary: 'Get all drivers' })
  async getAllDrivers() {
    const drivers = await this.driverService.findAll();
    return {
      succeeded: true,
      message: 'Drivers retrieved successfully',
      resultData: drivers
    };
  }

  @Get('user/:userId')
  @ApiOperation({ summary: 'Get driver by user ID' })
  async getDriverByUserId(@Param('userId') userId: string) {
    const driver = await this.driverService.findByUserId(userId);
    if (!driver) {
      throw new NotFoundException(`Driver with user ID ${userId} not found`);
    }
    return {
      succeeded: true,
      message: 'Driver retrieved successfully',
      resultData: driver
    };
  }

  @Get('license/:licenseNumber')
  @ApiOperation({ summary: 'Get driver by license number' })
  async getDriverByLicenseNumber(@Param('licenseNumber') licenseNumber: string) {
    const driver = await this.driverService.findByLicenseNumber(licenseNumber);
    if (!driver) {
      throw new NotFoundException(`Driver with license number ${licenseNumber} not found`);
    }
    return {
      succeeded: true,
      message: 'Driver retrieved successfully',
      resultData: driver
    };
  }

  @Post('apply')
  @ApiOperation({ summary: 'Create driver application (independent driver)' })
  async createApplication(@Body(new ValidationPipe()) driverData: CreateDriverApplicationDto) {
    const driver = await this.driverService.createApplication(driverData as any);
    return {
      succeeded: true,
      message: 'Driver application created successfully',
      resultData: driver
    };
  }

  @Post('company')
  @ApiOperation({ summary: 'Create company driver (admin only)' })
  async createCompanyDriver(@Body(new ValidationPipe()) driverData: CreateCompanyDriverDto) {
    const driver = await this.driverService.createCompanyDriver(driverData);
    return {
      succeeded: true,
      message: 'Company driver created successfully',
      resultData: driver
    };
  }

  @Put(':id')
  @ApiOperation({ summary: 'Update driver' })
  async updateDriver(@Param('id') id: string, @Body(new ValidationPipe()) driverData: Partial<UpdateDriverDto>) {
    const driver = await this.driverService.update(id, driverData);
    return {
      succeeded: true,
      message: 'Driver updated successfully',
      resultData: driver
    };
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Delete driver' })
  async deleteDriver(@Param('id') id: string) {
    await this.driverService.delete(id);
    return {
      succeeded: true,
      message: 'Driver deleted successfully'
    };
  }
}
