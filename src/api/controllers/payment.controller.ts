import { Body, Controller, Delete, Get, Param, Post, Put, ValidationPipe, NotFoundException } from '@nestjs/common';
import { PaymentService } from '../../domain/services/payment.service';
import { ApiOperation, ApiResponse } from '@nestjs/swagger';
import { CreatePaymentDto } from 'src/application/DTO/payment/create-payment.dto';
import { UpdatePaymentDto } from 'src/application/DTO/payment/update-payment.dto';
import { Payment } from 'src/domain/entities/payment.entity';

@Controller('payment')
export class PaymentController {
  constructor(private readonly paymentService: PaymentService) {}

  @Get(':id')
  @ApiOperation({ summary: 'Get payment by ID' })
  @ApiResponse({ status: 200, description: 'Payment retrieved successfully', type: Payment })
  async getPaymentById(@Param('id') id: string) {
    const payment = await this.paymentService.findById(id);
    if (!payment) throw new NotFoundException(`Payment with ID ${id} not found`);
    return { succeeded: true, message: 'Payment retrieved successfully', resultData: payment };
  }

  @Get()
  @ApiOperation({ summary: 'Get all payments' })
  @ApiResponse({ status: 200, description: 'Payments retrieved successfully', type: [Payment] })
  async getAllPayments() {
    const payments = await this.paymentService.findAll();
    return { succeeded: true, message: 'Payments retrieved successfully', resultData: payments };
  }

  @Get('ride/:rideId')
  @ApiOperation({ summary: 'Get payment by ride ID' })
  @ApiResponse({ status: 200, description: 'Payment retrieved successfully', type: Payment })
  async getPaymentByRideId(@Param('rideId') rideId: string) {
    const payment = await this.paymentService.findByRideId(rideId);
    if (!payment) throw new NotFoundException(`Payment for ride ${rideId} not found`);
    return { succeeded: true, message: 'Payment retrieved successfully', resultData: payment };
  }

  @Get('rider/:riderId')
  @ApiOperation({ summary: 'Get payments by rider ID' })
  @ApiResponse({ status: 200, description: 'Payments retrieved successfully', type: [Payment] })
  async getPaymentsByRiderId(@Param('riderId') riderId: string) {
    const payments = await this.paymentService.findByRiderId(riderId);
    return { succeeded: true, message: 'Payments retrieved successfully', resultData: payments };
  }

  @Post()
  @ApiOperation({ summary: 'Create payment' })
  @ApiResponse({ status: 201, description: 'Payment created successfully', type: Payment })
  async createPayment(@Body(new ValidationPipe()) paymentData: CreatePaymentDto) {
    const payment = await this.paymentService.create(paymentData as Payment);
    return { succeeded: true, message: 'Payment created successfully', resultData: payment };
  }

  @Put(':id')
  @ApiOperation({ summary: 'Update payment' })
  @ApiResponse({ status: 200, description: 'Payment updated successfully', type: Payment })
  async updatePayment(@Param('id') id: string, @Body(new ValidationPipe()) paymentData: Partial<UpdatePaymentDto>) {
    const payment = await this.paymentService.update(id, paymentData);
    return { succeeded: true, message: 'Payment updated successfully', resultData: payment };
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Delete payment' })
  @ApiResponse({ status: 200, description: 'Payment deleted successfully' })
  async deletePayment(@Param('id') id: string) {
    await this.paymentService.delete(id);
    return { succeeded: true, message: 'Payment deleted successfully' };
  }
}
