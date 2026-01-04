import { Body, Controller, Delete, Get, Param, Post, Put, ValidationPipe, NotFoundException } from '@nestjs/common';
import { PromotionUsageService } from '../../domain/services/promotion-usage.service';
import { ApiOperation, ApiResponse } from '@nestjs/swagger';
import { CreatePromotionUsageDto } from 'src/application/DTO/promotion-usage/create-promotion-usage.dto';
import { UpdatePromotionUsageDto } from 'src/application/DTO/promotion-usage/update-promotion-usage.dto';
import { PromotionUsage } from 'src/domain/entities/promotion-usage.entity';

@Controller('promotion-usage')
export class PromotionUsageController {
  constructor(private readonly promotionUsageService: PromotionUsageService) {}

  @Get(':id')
  @ApiOperation({ summary: 'Get promotion usage by ID' })
  @ApiResponse({ status: 200, description: 'Promotion usage retrieved successfully', type: PromotionUsage })
  async getById(@Param('id') id: string) {
    const usage = await this.promotionUsageService.findById(id);
    if (!usage) throw new NotFoundException(`Promotion usage with ID ${id} not found`);
    return { succeeded: true, message: 'Promotion usage retrieved successfully', resultData: usage };
  }

  @Get()
  @ApiOperation({ summary: 'Get all promotion usages' })
  @ApiResponse({ status: 200, description: 'Promotion usages retrieved successfully', type: [PromotionUsage] })
  async getAll() {
    const usages = await this.promotionUsageService.findAll();
    return { succeeded: true, message: 'Promotion usages retrieved successfully', resultData: usages };
  }

  @Get('promotion/:promotionId')
  @ApiOperation({ summary: 'Get usages by promotion ID' })
  @ApiResponse({ status: 200, description: 'Promotion usages retrieved successfully', type: [PromotionUsage] })
  async getByPromotionId(@Param('promotionId') promotionId: string) {
    const usages = await this.promotionUsageService.findByPromotionId(promotionId);
    return { succeeded: true, message: 'Promotion usages retrieved successfully', resultData: usages };
  }

  @Get('rider/:riderId')
  @ApiOperation({ summary: 'Get usages by rider ID' })
  @ApiResponse({ status: 200, description: 'Promotion usages retrieved successfully', type: [PromotionUsage] })
  async getByRiderId(@Param('riderId') riderId: string) {
    const usages = await this.promotionUsageService.findByRiderId(riderId);
    return { succeeded: true, message: 'Promotion usages retrieved successfully', resultData: usages };
  }

  @Post()
  @ApiOperation({ summary: 'Create promotion usage' })
  @ApiResponse({ status: 201, description: 'Promotion usage created successfully', type: PromotionUsage })
  async create(@Body(new ValidationPipe()) data: CreatePromotionUsageDto) {
    const usage = await this.promotionUsageService.create(data);
    return { succeeded: true, message: 'Promotion usage created successfully', resultData: usage };
  }

  @Put(':id')
  @ApiOperation({ summary: 'Update promotion usage' })
  @ApiResponse({ status: 200, description: 'Promotion usage updated successfully', type: PromotionUsage })
  async update(@Param('id') id: string, @Body(new ValidationPipe()) data: Partial<UpdatePromotionUsageDto>) {
    const usage = await this.promotionUsageService.update(id, data);
    return { succeeded: true, message: 'Promotion usage updated successfully', resultData: usage };
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Delete promotion usage' })
  @ApiResponse({ status: 200, description: 'Promotion usage deleted successfully' })
  async delete(@Param('id') id: string) {
    await this.promotionUsageService.delete(id);
    return { succeeded: true, message: 'Promotion usage deleted successfully' };
  }
}
