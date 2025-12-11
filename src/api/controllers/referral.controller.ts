import { Body, Controller, Delete, Get, Param, Post, Put, ValidationPipe, NotFoundException } from '@nestjs/common';
import { ReferralService } from '../../domain/services/referral.service';
import { ApiOperation } from '@nestjs/swagger';
import { CreateReferralDto } from 'src/application/DTO/referral/create-referral.dto';
import { UpdateReferralDto } from 'src/application/DTO/referral/update-referral.dto';

@Controller('referral')
export class ReferralController {
  constructor(private readonly referralService: ReferralService) {}

  @Get(':id')
  @ApiOperation({ summary: 'Get referral by ID' })
  async getById(@Param('id') id: string) {
    const referral = await this.referralService.findById(id);
    if (!referral) throw new NotFoundException(`Referral with ID ${id} not found`);
    return { succeeded: true, message: 'Referral retrieved successfully', resultData: referral };
  }

  @Get()
  @ApiOperation({ summary: 'Get all referrals' })
  async getAll() {
    const referrals = await this.referralService.findAll();
    return { succeeded: true, message: 'Referrals retrieved successfully', resultData: referrals };
  }

  @Get('referred/:referredId')
  @ApiOperation({ summary: 'Get referral by referred ID' })
  async getByReferredId(@Param('referredId') referredId: string) {
    const referral = await this.referralService.findByReferredId(referredId);
    if (!referral) throw new NotFoundException(`Referral for referred ${referredId} not found`);
    return { succeeded: true, message: 'Referral retrieved successfully', resultData: referral };
  }

  @Get('referrer/:referrerId')
  @ApiOperation({ summary: 'Get referrals by referrer ID' })
  async getByReferrerId(@Param('referrerId') referrerId: string) {
    const referrals = await this.referralService.findByReferrerId(referrerId);
    return { succeeded: true, message: 'Referrals retrieved successfully', resultData: referrals };
  }

  @Get('code/:code')
  @ApiOperation({ summary: 'Get referral by code' })
  async getByCode(@Param('code') code: string) {
    const referral = await this.referralService.findByCode(code);
    if (!referral) throw new NotFoundException(`Referral with code ${code} not found`);
    return { succeeded: true, message: 'Referral retrieved successfully', resultData: referral };
  }

  @Post()
  @ApiOperation({ summary: 'Create referral' })
  async create(@Body(new ValidationPipe()) data: CreateReferralDto) {
    const referral = await this.referralService.create(data as any);
    return { succeeded: true, message: 'Referral created successfully', resultData: referral };
  }

  @Put(':id')
  @ApiOperation({ summary: 'Update referral' })
  async update(@Param('id') id: string, @Body(new ValidationPipe()) data: Partial<UpdateReferralDto>) {
    const referral = await this.referralService.update(id, data);
    return { succeeded: true, message: 'Referral updated successfully', resultData: referral };
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Delete referral' })
  async delete(@Param('id') id: string) {
    await this.referralService.delete(id);
    return { succeeded: true, message: 'Referral deleted successfully' };
  }
}
