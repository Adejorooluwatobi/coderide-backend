import { Body, Controller, Delete, Get, Param, Post, Put, ValidationPipe, NotFoundException } from '@nestjs/common';
import { FareEstimateService } from '../../domain/services/fare-estimate.service';
import { ApiOperation, ApiResponse } from '@nestjs/swagger';
import { CreateFareEstimateDto } from 'src/application/DTO/fare-estimate/create-fare-estimate.dto';
import { UpdateFareEstimateDto } from 'src/application/DTO/fare-estimate/update-fare-estimate.dto';
import { FareEstimate } from 'src/domain/entities/fare-estimate.entity';

@Controller('fare-estimate')
export class FareEstimateController {
  constructor(private readonly fareEstimateService: FareEstimateService) {}

  @Get(':id')
  @ApiOperation({ summary: 'Get fare estimate by ID' })
  @ApiResponse({ status: 200, description: 'Fare estimate retrieved successfully', type: FareEstimate })
  async getById(@Param('id') id: string) {
    const estimate = await this.fareEstimateService.findById(id);
    if (!estimate) throw new NotFoundException(`Fare estimate with ID ${id} not found`);
    return { succeeded: true, message: 'Fare estimate retrieved successfully', resultData: estimate };
  }

  @Get()
  @ApiOperation({ summary: 'Get all fare estimates' })
  @ApiResponse({ status: 200, description: 'Fare estimates retrieved successfully', type: [FareEstimate] })
  async getAll() {
    const estimates = await this.fareEstimateService.findAll();
    return { succeeded: true, message: 'Fare estimates retrieved successfully', resultData: estimates };
  }

  @Get('rider/:riderId')
  @ApiOperation({ summary: 'Get estimates by rider ID' })
  @ApiResponse({ status: 200, description: 'Fare estimates retrieved successfully', type: [FareEstimate] })
  async getByRiderId(@Param('riderId') riderId: string) {
    const estimates = await this.fareEstimateService.findByRiderId(riderId);
    return { succeeded: true, message: 'Fare estimates retrieved successfully', resultData: estimates };
  }

  @Post()
  @ApiOperation({ summary: 'Create fare estimate' })
  @ApiResponse({ status: 201, description: 'Fare estimate created successfully', type: FareEstimate })
  async create(@Body(new ValidationPipe()) data: CreateFareEstimateDto) {
    const estimate = await this.fareEstimateService.create(data);
    return { succeeded: true, message: 'Fare estimate created successfully', resultData: estimate };
  }

  @Put(':id')
  @ApiOperation({ summary: 'Update fare estimate' })
  @ApiResponse({ status: 200, description: 'Fare estimate updated successfully', type: FareEstimate })
  async update(@Param('id') id: string, @Body(new ValidationPipe()) data: Partial<UpdateFareEstimateDto>) {
    const estimate = await this.fareEstimateService.update(id, data);
    return { succeeded: true, message: 'Fare estimate updated successfully', resultData: estimate };
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Delete fare estimate' })
  @ApiResponse({ status: 200, description: 'Fare estimate deleted successfully' })
  async delete(@Param('id') id: string) {
    await this.fareEstimateService.delete(id);
    return { succeeded: true, message: 'Fare estimate deleted successfully' };
  }
}
