import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication, ValidationPipe } from '@nestjs/common';
import request from 'supertest';
import { AppModule } from '../src/app.module';

describe('PaymentMethodController (e2e)', () => {
  let app: INestApplication;
  let userId: string;
  let paymentMethodId: string;

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    app.setGlobalPrefix('api');
    app.useGlobalPipes(new ValidationPipe());
    await app.init();

    // Create a user
    const userRes = await request(app.getHttpServer()).post('/api/user').send({
      email: `pm_user_${Date.now()}@example.com`,
      password: 'Password123!',
    });
    userId = userRes.body.resultData.id;
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
          cardNumber: '************4242',
          expiryMonth: 12,
          expiryYear: 2028,
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

      const response = await request(app.getHttpServer())
        .get(`/api/payment-method/user/${userId}`);
      
      expect(response.body.resultData.length).toBe(0);
    });
  });
});