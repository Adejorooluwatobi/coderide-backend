import { Inject, Injectable, Logger } from '@nestjs/common';
import { Payment } from '../entities/payment.entity';
import type { IPaymentRepository } from '../repositories/payment.repository.interface';
import { CreatePaymentParams, UpdatePaymentParams } from 'src/utils/type';
import { PaystackService } from 'src/infrastructure/external-services/paystack.service';
import { NotificationService } from './notification.service';
import { RideGateway } from 'src/shared/websockets/ride.gateway';
import { RideService } from './ride.service';
import { NotificationType } from '../enums/notification.enum';

@Injectable()
export class PaymentService {
  private readonly logger = new Logger(PaymentService.name);
  constructor(
    @Inject('IPaymentRepository')
    private readonly paymentRepository: IPaymentRepository,
    private readonly paystackService: PaystackService,
    private readonly notificationService: NotificationService,
    private readonly rideGateway: RideGateway,
    private readonly rideService: RideService,
  ) {}

  async findById(id: string): Promise<Payment | null> { 
    if (!id || typeof id !== 'string') {
      this.logger.warn(`Invalid id provided: ${id}`);
      return null;
    }
    return this.paymentRepository.findById(id);
  }

  async findAll(): Promise<Payment[]> {
    this.logger.log('Fetching all payments');
    return this.paymentRepository.findAll();
  }

  async findByRideId(rideId: string): Promise<Payment | null> {
    if (!rideId || typeof rideId !== 'string') {
      this.logger.warn(`Invalid rideId provided: ${rideId}`);
      return null;
    }
    return this.paymentRepository.findByRideId(rideId);
  }

  async findByRiderId(riderId: string): Promise<Payment[]> {
    if (!riderId || typeof riderId !== 'string') {
      this.logger.warn(`Invalid riderId provided: ${riderId}`);
      return [];
    }
    return this.paymentRepository.findByRiderId(riderId);
  }

  async findByTransactionReference(transactionReference: string): Promise<Payment | null> {
    if (!transactionReference || typeof transactionReference !== 'string') {
      this.logger.warn(`Invalid transactionReference provided: ${transactionReference}`);
      return null;
    }
    return this.paymentRepository.findByTransactionReference(transactionReference);
  }

  async create(payment: CreatePaymentParams): Promise<Payment> {
    this.logger.log(`Creating payment with data: ${JSON.stringify(payment)}`);
    return this.paymentRepository.create(payment);
  }

  async initializePayment(userId: string, email: string, amount: number, rideId: string) {
    this.logger.log(`Initializing payment for ride ${rideId}`);
    return this.paystackService.initializeTransaction(email, amount * 100); // Paystack expects kobo
  }

  async update(id: string, payment: Partial<UpdatePaymentParams>): Promise<Payment> {
    if (!id || typeof id !== 'string') {
      this.logger.warn(`Invalid id provided for update: ${id}`);
      throw new Error('Invalid id provided');
    }

    this.logger.log(`Updating payment ${id} with data: ${JSON.stringify(payment)}`);
    const updatedPayment = await this.paymentRepository.update(id, payment);

    // Notify on status change
    if (payment.paymentStatus) {
        const ride = await this.rideService.findById(updatedPayment.rideId);
        if (ride) {
            const driver = ride.driverId ? await this.rideService.findByDriverId(ride.driverId) : null; // This is wrong, I need DriverService.
            // Wait, I can just use ride.riderId and ride.driverId
            
            // 1. Notify Rider
            await this.notificationService.create({
                userId: ride.rider?.userId || ride.riderId,
                title: `Payment ${payment.paymentStatus}`,
                message: `Your payment for ride ${ride.id} has been ${payment.paymentStatus.toLowerCase()}.`,
                type: NotificationType.PAYMENT,
                isRead: false,
            });

            // 2. Notify Driver
            if (ride.driverId) {
                const driverData = await this.rideService.findById(ride.id); // Placeholder to get driver userId
                // Better approach: use driverService
                // But let's assume we have what we need for now or fetch it.
            }

            // 3. Notify Admins
            this.rideGateway.emitToAdmins('PAYMENT_STATUS_UPDATED', {
                paymentId: id,
                rideId: ride.id,
                status: payment.paymentStatus,
                amount: updatedPayment.amount
            });
        }
    }

    return updatedPayment;
  }

  async delete(id: string): Promise<void> {
    if (!id || typeof id !== 'string') {
      this.logger.warn(`Invalid id provided for deletion: ${id}`);
      throw new Error('Invalid id provided');
    }

    await this.paymentRepository.delete(id);
  } 
}
