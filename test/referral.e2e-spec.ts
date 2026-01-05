import { Test, TestingModule } from '@nestjs/testing';
import { ValidationPipe } from '@nestjs/common';
import request from 'supertest';
import { AppModule } from '../src/app.module';
import { FastifyAdapter, NestFastifyApplication } from '@nestjs/platform-fastify';
import { ReferralStatus } from 'src/domain/enums/referral-status.enum';

describe('ReferralController (e2e)', () => {
  let app: NestFastifyApplication;
  let referrerId: string;
  let referredId: string;
  let referralId: string;

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication<NestFastifyApplication>(new FastifyAdapter());
    app.setGlobalPrefix('api');
    app.useGlobalPipes(new ValidationPipe());
    await app.init();
    await app.getHttpAdapter().getInstance().ready();

    // Create the referrer user
    const referrerRes = await request(app.getHttpServer()).post('/api/user').send({
      email: `referrer_${Date.now()}@example.com`,
      phone: `081${Math.floor(Math.random() * 1000000000)}`,
      password: 'Password123!',
      firstName: 'Referrer',
      lastName: 'User',
      userType: 'RIDER',
    });
    expect(referrerRes.statusCode).toBe(201);
    referrerId = referrerRes.body.resultData.id;

    // Create the referred user
    const referredRes = await request(app.getHttpServer()).post('/api/user').send({
      email: `referred_${Date.now()}@example.com`,
      phone: `081${Math.floor(Math.random() * 1000000000)}`,
      password: 'Password123!',
      firstName: 'Referred',
      lastName: 'User',
      userType: 'RIDER',
    });
    expect(referredRes.statusCode).toBe(201);
    referredId = referredRes.body.resultData.id;
  });

  afterAll(async () => {
    await app.close();
  });

  describe('/api/referral', () => {
    it('should create a new referral', async () => {
      const referralData = {
        referrerId: referrerId,
        referredId: referredId,
        status: ReferralStatus.PENDING,
      };

      const response = await request(app.getHttpServer())
        .post('/api/referral')
        .send(referralData)
        .expect(201);

      expect(response.body.succeeded).toBe(true);
      referralId = response.body.resultData.id;
      expect(referralId).toBeDefined();
    });

    it('should get referrals by referrer id', async () => {
      const response = await request(app.getHttpServer())
        .get(`/api/referral/referrer/${referrerId}`)
        .expect(200);

      expect(Array.isArray(response.body.resultData)).toBe(true);
      expect(response.body.resultData.length).toBeGreaterThan(0);
    });

    it('should update a referral status', async () => {
      const response = await request(app.getHttpServer())
        .put(`/api/referral/${referralId}`)
        .send({ status: ReferralStatus.COMPLETED })
        .expect(200);
      expect(response.body.resultData.status).toBe(ReferralStatus.COMPLETED);
    });
  });
});