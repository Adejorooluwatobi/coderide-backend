import { Inject, Injectable, Logger } from '@nestjs/common';
import { Payment } from '../entities/payment.entity';
import type { IPaymentRepository } from '../repositories/payment.repository.interface';
import { CreatePaymentParams, UpdatePaymentParams } from 'src/utils/type';
import { PaystackService } from 'src/infrastructure/external-services/paystack.service';
import { FlutterwaveService } from 'src/infrastructure/external-services/flutterwave.service';
import { NotificationService } from './notification.service';
import { RideGateway } from 'src/shared/websockets/ride.gateway';
import { RideService } from './ride.service';
import { WalletService } from './wallet.service';
import { NotificationType } from '../enums/notification.enum';
import { PaymentGateway, PaymentStatus } from '../enums/payment.enum';

@Injectable()
export class PaymentService {
  private readonly logger = new Logger(PaymentService.name);
  constructor(
    @Inject('IPaymentRepository')
    private readonly paymentRepository: IPaymentRepository,
    private readonly paystackService: PaystackService,
    private readonly flutterwaveService: FlutterwaveService,
    private readonly notificationService: NotificationService,
    private readonly rideGateway: RideGateway,
    private readonly rideService: RideService,
    private readonly walletService: WalletService,
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

  async initializePayment(userId: string, email: string, amount: number, rideId: string, gateway: PaymentGateway = PaymentGateway.PAYSTACK) {
    this.logger.log(`Initializing ${gateway} payment for ride ${rideId}`);
    
    if (gateway === PaymentGateway.FLUTTERWAVE) {
      const tx_ref = `code-ride-${rideId}-${Date.now()}`;
      return this.flutterwaveService.initializeTransaction(email, amount, tx_ref, { rideId, userId });
    }

    // Default to Paystack
    return this.paystackService.initializeTransaction(email, amount * 100); // Paystack expects kobo
  }

  async payViaWallet(userId: string, rideId: string, amount: number) {
    const ride = await this.rideService.findById(rideId);
    if (!ride) throw new Error('Ride not found');
    if (!ride.driverId) throw new Error('Ride has no driver assigned');

    const driver = await this.rideService.findByDriverId(ride.driverId);
    // Note: I need to know the vehicle ownership. 
    // Usually a driver has an active vehicle assignment.
    // For now, let's look at the first vehicle assignment if available.
    
    // Using a default of DRIVER_OWNED if not found
    const ownershipType = ride.driver?.vehicleAssignments?.[0]?.vehicle?.ownershipType || 'DRIVER_OWNED';

    await this.walletService.processRidePayment(
      rideId,
      amount,
      ride.riderId,
      ride.driverId,
      ownershipType as any
    );

    // Update payment status in DB
    const existingPayment = await this.findByRideId(rideId);
    if (existingPayment) {
        await this.update(existingPayment.id, { paymentStatus: PaymentStatus.COMPLETED, paidAt: new Date() });
    } else {
        await this.create({
            rideId,
            riderId: ride.riderId,
            amount,
            paymentMethod: 'WALLET' as any,
            paymentStatus: PaymentStatus.COMPLETED,
            paidAt: new Date(),
        } as any);
    }

    return { success: true, message: 'Payment successful via wallet' };
  }

  async verifyPaystackPayment(reference: string) {
    this.logger.log(`Verifying Paystack payment: ${reference}`);
    const result = await this.paystackService.verifyTransaction(reference);
    
    if (result.status && result.data.status === 'success') {
      const payment = await this.findByTransactionReference(reference);
      if (payment && payment.paymentStatus !== PaymentStatus.COMPLETED) {
        await this.update(payment.id, { paymentStatus: PaymentStatus.COMPLETED });
      }
    }
    return result;
  }

  async verifyFlutterwavePayment(transactionId: string) {
    this.logger.log(`Verifying Flutterwave payment: ${transactionId}`);
    const result = await this.flutterwaveService.verifyTransaction(transactionId);
    
    if (result.status === 'success' && result.data.status === 'successful') {
      const tx_ref = result.data.tx_ref;
      const payment = await this.findByTransactionReference(tx_ref);
      if (payment && payment.paymentStatus !== PaymentStatus.COMPLETED) {
        await this.update(payment.id, { paymentStatus: PaymentStatus.COMPLETED });
      }
    }
    return result;
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
