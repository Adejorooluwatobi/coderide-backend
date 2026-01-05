import { Body, Controller, Delete, Get, Param, Post, Put, ValidationPipe, NotFoundException, UseGuards } from '@nestjs/common';
import { PaymentMethodService } from '../../domain/services/payment-method.service';
import { ApiOperation, ApiResponse } from '@nestjs/swagger';
import { CreatePaymentMethodDto } from 'src/application/DTO/payment-method/create-payment-method.dto';
import { UpdatePaymentMethodDto } from 'src/application/DTO/payment-method/update-payment-method.dto';
import { PaymentMethod } from 'src/domain/entities/payment-method.entity';
import { UserGuard } from '../auth/guards';
import { User } from 'src/shared/common/decorators/user.decorator';

@Controller('payment-method')
export class PaymentMethodController {
  constructor(private readonly paymentMethodService: PaymentMethodService) {}

  @Get(':id')
  @ApiOperation({ summary: 'Get payment method by ID' })
  @ApiResponse({ status: 200, description: 'Payment method retrieved successfully', type: PaymentMethod })
  async getById(@Param('id') id: string) {
    const method = await this.paymentMethodService.findById(id);
    if (!method) throw new NotFoundException(`Payment method with ID ${id} not found`);
    return { succeeded: true, message: 'Payment method retrieved successfully', resultData: method };
  }

  @Get()
  @ApiOperation({ summary: 'Get all payment methods' })
  @ApiResponse({ status: 200, description: 'Payment methods retrieved successfully', type: [PaymentMethod] })
  async getAll() {
    const methods = await this.paymentMethodService.findAll();
    return { succeeded: true, message: 'Payment methods retrieved successfully', resultData: methods };
  }

  @Get('user/:userId')
  @ApiOperation({ summary: 'Get payment methods by user ID' })
  @ApiResponse({ status: 200, description: 'Payment methods retrieved successfully', type: [PaymentMethod] })
  async getByUserId(@Param('userId') userId: string) {
    const methods = await this.paymentMethodService.findByUserId(userId);
    return { succeeded: true, message: 'Payment methods retrieved successfully', resultData: methods };
  }

  @Post()
  @UseGuards(UserGuard)
  @ApiOperation({ summary: 'Create payment method' })
  @ApiResponse({ status: 201, description: 'Payment method created successfully', type: PaymentMethod })
  async create(@Body(new ValidationPipe()) data: CreatePaymentMethodDto, @User() user: any) {
    const userId = user.sub;
    const method = await this.paymentMethodService.create({ ...data, userId });
    return { succeeded: true, message: 'Payment method created successfully', resultData: method };
  }

  @Put(':id')
  @ApiOperation({ summary: 'Update payment method' })
  @ApiResponse({ status: 200, description: 'Payment method updated successfully', type: PaymentMethod })
  async update(@Param('id') id: string, @Body(new ValidationPipe()) data: Partial<UpdatePaymentMethodDto>) {
    const method = await this.paymentMethodService.update(id, data);
    return { succeeded: true, message: 'Payment method updated successfully', resultData: method };
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Delete payment method' })
  @ApiResponse({ status: 200, description: 'Payment method deleted successfully' })
  async delete(@Param('id') id: string) {
    await this.paymentMethodService.delete(id);
    return { succeeded: true, message: 'Payment method deleted successfully' };
  }
}
