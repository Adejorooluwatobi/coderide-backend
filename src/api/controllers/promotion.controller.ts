import { Body, Controller, Delete, Get, Param, Post, Put, ValidationPipe, NotFoundException } from '@nestjs/common';
import { PromotionService } from '../../domain/services/promotion.service';
import { ApiOperation } from '@nestjs/swagger';
import { CreatePromotionDto } from 'src/application/DTO/promotion/create-promotion.dto';
import { UpdatePromotionDto } from 'src/application/DTO/promotion/update-promotion.dto';

@Controller('promotion')
export class PromotionController {
  constructor(private readonly promotionService: PromotionService) {}

  @Get(':id')
  @ApiOperation({ summary: 'Get promotion by ID' })
  async getById(@Param('id') id: string) {
    const promotion = await this.promotionService.findById(id);
    if (!promotion) throw new NotFoundException(`Promotion with ID ${id} not found`);
    return { succeeded: true, message: 'Promotion retrieved successfully', resultData: promotion };
  }

  @Get()
  @ApiOperation({ summary: 'Get all promotions' })
  async getAll() {
    const promotions = await this.promotionService.findAll();
    return { succeeded: true, message: 'Promotions retrieved successfully', resultData: promotions };
  }

  @Get('code/:code')
  @ApiOperation({ summary: 'Get promotion by code' })
  async getByCode(@Param('code') code: string) {
    const promotion = await this.promotionService.findByCode(code);
    if (!promotion) throw new NotFoundException(`Promotion with code ${code} not found`);
    return { succeeded: true, message: 'Promotion retrieved successfully', resultData: promotion };
  }

  @Get('active/list')
  @ApiOperation({ summary: 'Get active promotions' })
  async getActive() {
    const promotions = await this.promotionService.findActivePromotions();
    return { succeeded: true, message: 'Active promotions retrieved successfully', resultData: promotions };
  }

  @Post()
  @ApiOperation({ summary: 'Create promotion' })
  async create(@Body(new ValidationPipe()) data: CreatePromotionDto) {
    const promotion = await this.promotionService.create(data);
    return { succeeded: true, message: 'Promotion created successfully', resultData: promotion };
  }

  @Put(':id')
  @ApiOperation({ summary: 'Update promotion' })
  async update(@Param('id') id: string, @Body(new ValidationPipe()) data: Partial<UpdatePromotionDto>) {
    const promotion = await this.promotionService.update(id, data);
    return { succeeded: true, message: 'Promotion updated successfully', resultData: promotion };
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Delete promotion' })
  async delete(@Param('id') id: string) {
    await this.promotionService.delete(id);
    return { succeeded: true, message: 'Promotion deleted successfully' };
  }
}
