import { Test, TestingModule } from '@nestjs/testing';
import { ValidationPipe } from '@nestjs/common';
import request from 'supertest';
import { AppModule } from '../src/app.module';
import { FastifyAdapter, NestFastifyApplication } from '@nestjs/platform-fastify';

describe('PromotionUsageController (e2e)', () => {
  let app: NestFastifyApplication;
  let userId: string;
  let promotionId: string;
  let promotionUsageId: string;

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
      email: `promo_usage_user_${Date.now()}@example.com`,
      password: 'Password123!',
    });
    userId = userRes.body.resultData.id;

    // Create a promotion to be used
    const promoRes = await request(app.getHttpServer()).post('/api/promotion').send({
        code: `USEME${Date.now()}`,
        description: 'A test promotion',
        discountPercentage: 5,
        isActive: true,
    });
    promotionId = promoRes.body.resultData.id;
  });

  afterAll(async () => {
    await app.close();
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
      promotionUsageId = response.body.resultData.id;
      expect(promotionUsageId).toBeDefined();
    });

    it('should get promotion usages by user', async () => {
      const response = await request(app.getHttpServer())
        .get(`/api/promotion-usage/user/${userId}`)
        .expect(200);
      expect(Array.isArray(response.body.resultData)).toBe(true);
      expect(response.body.resultData.length).toBeGreaterThan(0);
    });

    it('should get promotion usages by promotion', async () => {
        const response = await request(app.getHttpServer())
          .get(`/api/promotion-usage/promotion/${promotionId}`)
          .expect(200);
        expect(Array.isArray(response.body.resultData)).toBe(true);
        expect(response.body.resultData.length).toBeGreaterThan(0);
      });
  });
});