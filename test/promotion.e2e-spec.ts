import { Test, TestingModule } from '@nestjs/testing';
import { ValidationPipe } from '@nestjs/common';
import request from 'supertest';
import { AppModule } from '../src/app.module';
import { FastifyAdapter, NestFastifyApplication } from '@nestjs/platform-fastify';

describe('Promotion & PromotionUsage Controllers (e2e)', () => {
  let app: NestFastifyApplication;
  let userId: string;
  let promotionId: string;
  const promoCode = `SAVE${Date.now()}`;

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication<NestFastifyApplication>(new FastifyAdapter());
    app.setGlobalPrefix('api');
    app.useGlobalPipes(new ValidationPipe());
    await app.init();

    // Create a user for the tests
    const userRes = await request(app.getHttpServer()).post('/api/user').send({
      email: `promo_user_${Date.now()}@example.com`,
      password: 'Password123!',
    });
    userId = userRes.body.resultData.id;
  });

  afterAll(async () => {
    await app.close();
  });

  describe('/api/promotion', () => {
    it('should create a new promotion', async () => {
      const promotionData = {
        code: promoCode,
        description: '10% off your next ride',
        discountPercentage: 10,
        maxDiscountAmount: 500,
        startDate: new Date(),
        endDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000), // 7 days from now
        isActive: true,
      };

      const response = await request(app.getHttpServer())
        .post('/api/promotion')
        .send(promotionData)
        .expect(201);

      expect(response.body.succeeded).toBe(true);
      promotionId = response.body.resultData.id;
      expect(promotionId).toBeDefined();
    });

    it('should get a promotion by code', async () => {
      const response = await request(app.getHttpServer())
        .get(`/api/promotion/code/${promoCode}`)
        .expect(200);
      expect(response.body.resultData.code).toBe(promoCode);
    });

    it('should get all promotions', async () => {
      const response = await request(app.getHttpServer())
        .get('/api/promotion')
        .expect(200);
      expect(Array.isArray(response.body.resultData)).toBe(true);
    });

    it('should update a promotion', async () => {
      const response = await request(app.getHttpServer())
        .put(`/api/promotion/${promotionId}`)
        .send({ description: '15% off your next ride' })
        .expect(200);
      expect(response.body.resultData.description).toBe('15% off your next ride');
    });
  });

  describe('/api/promotion-usage', () => {
    it('should record a promotion usage', async () => {
      const usageData = {
        userId: userId,
        promotionId: promotionId,
        usedAt: new Date(),
      };

      const response = await request(app.getHttpServer())
        .post('/api/promotion-usage')
        .send(usageData)
        .expect(201);

      expect(response.body.succeeded).toBe(true);
      expect(response.body.resultData).toHaveProperty('id');
    });

    it('should get promotion usages by user', async () => {
      const response = await request(app.getHttpServer())
        .get(`/api/promotion-usage/user/${userId}`)
        .expect(200);
      expect(Array.isArray(response.body.resultData)).toBe(true);
      expect(response.body.resultData.length).toBeGreaterThan(0);
    });
  });

  describe('DELETE /api/promotion/:id', () => {
    it('should delete a promotion', async () => {
      await request(app.getHttpServer())
        .delete(`/api/promotion/${promotionId}`)
        .expect(200);
    });
  });
});