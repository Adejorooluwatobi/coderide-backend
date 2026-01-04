import { Body, Controller, Delete, Get, Param, Post, Put, ValidationPipe, NotFoundException } from '@nestjs/common';
import { SurgeZoneService } from '../../domain/services/surge-zone.service';
import { ApiOperation, ApiResponse } from '@nestjs/swagger';
import { CreateSurgeZoneDto } from 'src/application/DTO/surge-zone/create-surge-zone.dto';
import { UpdateSurgeZoneDto } from 'src/application/DTO/surge-zone/update-surge-zone.dto';
import { SurgeZone } from 'src/domain/entities/surge-zone.entity';

@Controller('surge-zone')
export class SurgeZoneController {
  constructor(private readonly surgeZoneService: SurgeZoneService) {}

  @Get(':id')
  @ApiOperation({ summary: 'Get surge zone by ID' })
  @ApiResponse({ status: 200, description: 'Surge zone retrieved successfully', type: SurgeZone })
  async getById(@Param('id') id: string) {
    const zone = await this.surgeZoneService.findById(id);
    if (!zone) throw new NotFoundException(`Surge zone with ID ${id} not found`);
    return { succeeded: true, message: 'Surge zone retrieved successfully', resultData: zone };
  }

  @Get()
  @ApiOperation({ summary: 'Get all surge zones' })
  @ApiResponse({ status: 200, description: 'Surge zones retrieved successfully', type: [SurgeZone] })
  async getAll() {
    const zones = await this.surgeZoneService.findAll();
    return { succeeded: true, message: 'Surge zones retrieved successfully', resultData: zones };
  }

  @Get('active/list')
  @ApiOperation({ summary: 'Get active surge zones' })
  @ApiResponse({ status: 200, description: 'Active surge zones retrieved successfully', type: [SurgeZone] })
  async getActive() {
    const zones = await this.surgeZoneService.findActiveSurgeZones();
    return { succeeded: true, message: 'Active surge zones retrieved successfully', resultData: zones };
  }

  @Post()
  @ApiOperation({ summary: 'Create surge zone' })
  @ApiResponse({ status: 201, description: 'Surge zone created successfully', type: SurgeZone })
  async create(@Body(new ValidationPipe()) data: CreateSurgeZoneDto) {
    const zone = await this.surgeZoneService.create(data);
    return { succeeded: true, message: 'Surge zone created successfully', resultData: zone };
  }

  @Put(':id')
  @ApiOperation({ summary: 'Update surge zone' })
  @ApiResponse({ status: 200, description: 'Surge zone updated successfully', type: SurgeZone })
  async update(@Param('id') id: string, @Body(new ValidationPipe()) data: Partial<UpdateSurgeZoneDto>) {
    const zone = await this.surgeZoneService.update(id, data);
    return { succeeded: true, message: 'Surge zone updated successfully', resultData: zone };
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Delete surge zone' })
  @ApiResponse({ status: 200, description: 'Surge zone deleted successfully' })
  async delete(@Param('id') id: string) {
    await this.surgeZoneService.delete(id);
    return { succeeded: true, message: 'Surge zone deleted successfully' };
  }
}
