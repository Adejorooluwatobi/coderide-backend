import { Body, Controller, Delete, Get, Param, Post, Put, ValidationPipe, NotFoundException } from '@nestjs/common';
import { FareEstimateService } from '../../domain/services/fare-estimate.service';
import { ApiOperation } from '@nestjs/swagger';
import { CreateFareEstimateDto } from 'src/application/DTO/fare-estimate/create-fare-estimate.dto';
import { UpdateFareEstimateDto } from 'src/application/DTO/fare-estimate/update-fare-estimate.dto';

@Controller('fare-estimate')
export class FareEstimateController {
  constructor(private readonly fareEstimateService: FareEstimateService) {}

  @Get(':id')
  @ApiOperation({ summary: 'Get fare estimate by ID' })
  async getById(@Param('id') id: string) {
    const estimate = await this.fareEstimateService.findById(id);
    if (!estimate) throw new NotFoundException(`Fare estimate with ID ${id} not found`);
    return { succeeded: true, message: 'Fare estimate retrieved successfully', resultData: estimate };
  }

  @Get()
  @ApiOperation({ summary: 'Get all fare estimates' })
  async getAll() {
    const estimates = await this.fareEstimateService.findAll();
    return { succeeded: true, message: 'Fare estimates retrieved successfully', resultData: estimates };
  }

  @Get('rider/:riderId')
  @ApiOperation({ summary: 'Get estimates by rider ID' })
  async getByRiderId(@Param('riderId') riderId: string) {
    const estimates = await this.fareEstimateService.findByRiderId(riderId);
    return { succeeded: true, message: 'Fare estimates retrieved successfully', resultData: estimates };
  }

  @Post()
  @ApiOperation({ summary: 'Create fare estimate' })
  async create(@Body(new ValidationPipe()) data: CreateFareEstimateDto) {
    const estimate = await this.fareEstimateService.create(data);
    return { succeeded: true, message: 'Fare estimate created successfully', resultData: estimate };
  }

  @Put(':id')
  @ApiOperation({ summary: 'Update fare estimate' })
  async update(@Param('id') id: string, @Body(new ValidationPipe()) data: Partial<UpdateFareEstimateDto>) {
    const estimate = await this.fareEstimateService.update(id, data);
    return { succeeded: true, message: 'Fare estimate updated successfully', resultData: estimate };
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Delete fare estimate' })
  async delete(@Param('id') id: string) {
    await this.fareEstimateService.delete(id);
    return { succeeded: true, message: 'Fare estimate deleted successfully' };
  }
}
