import { Body, Controller, Delete, Get, Param, Post, Put, ValidationPipe, NotFoundException, Query } from '@nestjs/common';
import { PaymentService } from '../../domain/services/payment.service';
import { ApiOperation, ApiResponse, ApiTags, ApiQuery } from '@nestjs/swagger';
import { CreatePaymentDto } from 'src/application/DTO/payment/create-payment.dto';
import { UpdatePaymentDto } from 'src/application/DTO/payment/update-payment.dto';
import { Payment } from 'src/domain/entities/payment.entity';
import { PaymentGateway } from 'src/domain/enums/payment.enum';

@ApiTags('Payments')
@Controller('payment')
export class PaymentController {
  constructor(private readonly paymentService: PaymentService) {}

  @Post('initialize')
  @ApiOperation({ summary: 'Initialize a payment' })
  @ApiQuery({ name: 'gateway', enum: PaymentGateway, required: false })
  async initializePayment(
    @Body() data: { userId: string; email: string; amount: number; rideId: string },
    @Query('gateway') gateway: PaymentGateway = PaymentGateway.PAYSTACK
  ) {
    const result = await this.paymentService.initializePayment(data.userId, data.email, data.amount, data.rideId, gateway);
    return { succeeded: true, message: 'Payment initialized successfully', resultData: result };
  }

  @Get('verify/:reference')
  @ApiOperation({ summary: 'Verify a payment' })
  @ApiQuery({ name: 'gateway', enum: PaymentGateway, required: false })
  async verifyPayment(
    @Param('reference') reference: string,
    @Query('gateway') gateway: PaymentGateway = PaymentGateway.PAYSTACK
  ) {
    // Note: 'reference' is the Paystack reference or Flutterwave transaction ID
    let result;
    if (gateway === PaymentGateway.FLUTTERWAVE) {
      result = await this.paymentService.verifyFlutterwavePayment(reference);
    } else {
      result = await this.paymentService.verifyPaystackPayment(reference);
    }
    return { succeeded: true, message: 'Payment verification processed', resultData: result };
  }

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
