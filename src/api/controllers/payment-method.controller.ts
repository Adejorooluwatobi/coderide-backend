import { Body, Controller, Delete, Get, Param, Post, Put, ValidationPipe, NotFoundException, UseGuards } from '@nestjs/common';
import { PaymentMethodService } from '../../domain/services/payment-method.service';
import { ApiOperation } from '@nestjs/swagger';
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
  async getById(@Param('id') id: string) {
    const method = await this.paymentMethodService.findById(id);
    if (!method) throw new NotFoundException(`Payment method with ID ${id} not found`);
    return { succeeded: true, message: 'Payment method retrieved successfully', resultData: method };
  }

  @Get()
  @ApiOperation({ summary: 'Get all payment methods' })
  async getAll() {
    const methods = await this.paymentMethodService.findAll();
    return { succeeded: true, message: 'Payment methods retrieved successfully', resultData: methods };
  }

  @Get('user/:userId')
  @ApiOperation({ summary: 'Get payment methods by user ID' })
  async getByUserId(@Param('userId') userId: string) {
    const methods = await this.paymentMethodService.findByUserId(userId);
    return { succeeded: true, message: 'Payment methods retrieved successfully', resultData: methods };
  }

  @Post()
  @UseGuards(UserGuard)
  @ApiOperation({ summary: 'Create payment method' })
  async create(@Body(new ValidationPipe()) data: CreatePaymentMethodDto, @User() user: any) {
    const userId = user.sub;
    const method = await this.paymentMethodService.create({ ...data, userId });
    return { succeeded: true, message: 'Payment method created successfully', resultData: method };
  }

  @Put(':id')
  @ApiOperation({ summary: 'Update payment method' })
  async update(@Param('id') id: string, @Body(new ValidationPipe()) data: Partial<UpdatePaymentMethodDto>) {
    const method = await this.paymentMethodService.update(id, data);
    return { succeeded: true, message: 'Payment method updated successfully', resultData: method };
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Delete payment method' })
  async delete(@Param('id') id: string) {
    await this.paymentMethodService.delete(id);
    return { succeeded: true, message: 'Payment method deleted successfully' };
  }
}
