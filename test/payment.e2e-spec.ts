import { Test, TestingModule } from '@nestjs/testing';
import { ValidationPipe } from '@nestjs/common';
import request from 'supertest';
import { AppModule } from '../src/app.module';
import { FastifyAdapter, NestFastifyApplication } from '@nestjs/platform-fastify';
import { PaymentStatus } from 'src/domain/enums/payment.enum';

describe('Payment & PaymentMethod Controllers (e2e)', () => {
  let app: NestFastifyApplication;
  let userId: string;
  let rideId: string;
  let paymentMethodId: string;
  let paymentId: string;
  let authToken: string;

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication<NestFastifyApplication>(new FastifyAdapter());
    app.setGlobalPrefix('api');
    app.useGlobalPipes(new ValidationPipe());
    await app.init();
    await app.getHttpAdapter().getInstance().ready();

    // Create a user
    const email = `payment_user_${Date.now()}@example.com`;
    const userRes = await request(app.getHttpServer()).post('/api/user').send({
      email,
      phone: `081${Math.floor(Math.random() * 1000000000)}`,
      password: 'Password123!',
      firstName: 'Payment',
      lastName: 'User',
      userType: 'RIDER',
    });
    expect(userRes.statusCode).toBe(201);
    userId = userRes.body.resultData.id;

    // Login
    const loginRes = await request(app.getHttpServer()).post('/api/auth/user/login').send({
      email,
      password: 'Password123!',
    });
    authToken = loginRes.body.accessToken;

    // Create a rider profile
    const riderRes = await request(app.getHttpServer())
      .post('/api/rider')
      .set('Authorization', `Bearer ${authToken}`)
      .send({ userId });
    expect(riderRes.statusCode).toBe(201);
    const riderId = riderRes.body.resultData.id;

    // Create a ride
    const rideRes = await request(app.getHttpServer()).post('/api/ride').send({
      riderId,
      pickupAddress: 'A',
      destinationAddress: 'B',
      pickupLatitude: 1,
      pickupLongitude: 1,
      destinationLatitude: 2,
      destinationLongitude: 2,
    });
    expect(rideRes.statusCode).toBe(201);
    rideId = rideRes.body.resultData.id;
  });

  afterAll(async () => {
    await app.close();
  });

  describe('/api/payment-method', () => {
    it('should create a new payment method', async () => {
      const paymentMethodData = {
        userId: userId,
        type: 'CARD',
        details: {
          cardNumber: '************1234',
          expiryMonth: 12,
          expiryYear: 2025,
        },
        isDefault: true,
      };

      const response = await request(app.getHttpServer())
        .post('/api/payment-method')
        .send(paymentMethodData)
        .expect(201);

      expect(response.body.succeeded).toBe(true);
      paymentMethodId = response.body.resultData.id;
      expect(paymentMethodId).toBeDefined();
    });

    it('should get payment methods for a user', async () => {
      const response = await request(app.getHttpServer())
        .get(`/api/payment-method/user/${userId}`)
        .expect(200);

      expect(Array.isArray(response.body.resultData)).toBe(true);
      expect(response.body.resultData.length).toBeGreaterThan(0);
    });

    it('should delete a payment method', async () => {
      await request(app.getHttpServer())
        .delete(`/api/payment-method/${paymentMethodId}`)
        .expect(200);
    });
  });

  describe('/api/payment', () => {
    it('should create a new payment', async () => {
      const paymentData = {
        rideId: rideId,
        userId: userId,
        amount: 2500,
        currency: 'NGN',
        status: PaymentStatus.COMPLETED,
        transactionId: `txn_${Date.now()}`,
      };

      const response = await request(app.getHttpServer())
        .post('/api/payment')
        .send(paymentData)
        .expect(201);

      expect(response.body.succeeded).toBe(true);
      paymentId = response.body.resultData.id;
      expect(paymentId).toBeDefined();
      expect(response.body.resultData.amount).toBe(2500);
    });

    it('should get a payment by id', async () => {
      const response = await request(app.getHttpServer())
        .get(`/api/payment/${paymentId}`)
        .expect(200);
      expect(response.body.resultData.id).toBe(paymentId);
    });

    it('should get payment by ride id', async () => {
      const response = await request(app.getHttpServer())
        .get(`/api/payment/ride/${rideId}`)
        .expect(200);
      expect(response.body.resultData.rideId).toBe(rideId);
    });

    it('should get payments by user id', async () => {
      const response = await request(app.getHttpServer())
        .get(`/api/payment/user/${userId}`)
        .expect(200);
      expect(Array.isArray(response.body.resultData)).toBe(true);
      expect(response.body.resultData.length).toBeGreaterThan(0);
    });
  });
});