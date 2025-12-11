import { Body, Controller, Delete, Get, Param, Post, Put, ValidationPipe, NotFoundException } from '@nestjs/common';
import { SurgeZoneService } from '../../domain/services/surge-zone.service';
import { ApiOperation } from '@nestjs/swagger';
import { CreateSurgeZoneDto } from 'src/application/DTO/surge-zone/create-surge-zone.dto';
import { UpdateSurgeZoneDto } from 'src/application/DTO/surge-zone/update-surge-zone.dto';

@Controller('surge-zone')
export class SurgeZoneController {
  constructor(private readonly surgeZoneService: SurgeZoneService) {}

  @Get(':id')
  @ApiOperation({ summary: 'Get surge zone by ID' })
  async getById(@Param('id') id: string) {
    const zone = await this.surgeZoneService.findById(id);
    if (!zone) throw new NotFoundException(`Surge zone with ID ${id} not found`);
    return { succeeded: true, message: 'Surge zone retrieved successfully', resultData: zone };
  }

  @Get()
  @ApiOperation({ summary: 'Get all surge zones' })
  async getAll() {
    const zones = await this.surgeZoneService.findAll();
    return { succeeded: true, message: 'Surge zones retrieved successfully', resultData: zones };
  }

  @Get('active/list')
  @ApiOperation({ summary: 'Get active surge zones' })
  async getActive() {
    const zones = await this.surgeZoneService.findActiveSurgeZones();
    return { succeeded: true, message: 'Active surge zones retrieved successfully', resultData: zones };
  }

  @Post()
  @ApiOperation({ summary: 'Create surge zone' })
  async create(@Body(new ValidationPipe()) data: CreateSurgeZoneDto) {
    const zone = await this.surgeZoneService.create(data);
    return { succeeded: true, message: 'Surge zone created successfully', resultData: zone };
  }

  @Put(':id')
  @ApiOperation({ summary: 'Update surge zone' })
  async update(@Param('id') id: string, @Body(new ValidationPipe()) data: Partial<UpdateSurgeZoneDto>) {
    const zone = await this.surgeZoneService.update(id, data);
    return { succeeded: true, message: 'Surge zone updated successfully', resultData: zone };
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Delete surge zone' })
  async delete(@Param('id') id: string) {
    await this.surgeZoneService.delete(id);
    return { succeeded: true, message: 'Surge zone deleted successfully' };
  }
}
