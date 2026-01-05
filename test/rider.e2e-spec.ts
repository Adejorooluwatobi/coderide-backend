import { Test, TestingModule } from '@nestjs/testing';
import { ValidationPipe } from '@nestjs/common';
import request from 'supertest';
import { TestAppModule } from './test-app.module';
import { FastifyAdapter, NestFastifyApplication } from '@nestjs/platform-fastify';

describe('RiderController (e2e)', () => {
  let app: NestFastifyApplication;
  let createdUserId: string;
  let createdRiderId: string;
  let authToken: string;

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [TestAppModule],
    }).compile();

    app = moduleFixture.createNestApplication<NestFastifyApplication>(new FastifyAdapter());
    app.setGlobalPrefix('api');
    app.useGlobalPipes(new ValidationPipe());
    await app.init();
    await app.getHttpAdapter().getInstance().ready();

    // Create a user and get auth token for authenticated endpoints
    const userEmail = `rider_user_${Date.now()}@example.com`;
    const userResponse = await request(app.getHttpServer())
      .post('/api/user')
      .send({
        email: userEmail,
        phone: `081${Math.floor(Math.random() * 1000000000)}`,
        password: 'Password123!',
        firstName: 'Test',
        lastName: 'RiderUser',
        userType: 'RIDER',
      });

    expect(userResponse.statusCode).toBe(201);
    createdUserId = userResponse.body.resultData.id;

    // Login to get auth token
    const loginResponse = await request(app.getHttpServer())
      .post('/api/auth/user/login')
      .send({
        email: userEmail,
        password: 'Password123!',
      });

    expect(loginResponse.statusCode).toBe(200);
    authToken = loginResponse.body.accessToken;
  });

  afterAll(async () => {
    await app.close();
  });

  describe('/api/rider', () => {
    it('should create a new rider profile', async () => {
      const riderData = {
        userId: createdUserId,
        preferredLanguage: 'en',
      };

      const response = await request(app.getHttpServer())
        .post('/api/rider')
        .set('Authorization', `Bearer ${authToken}`)
        .send(riderData)
        .expect(201);

      expect(response.body.succeeded).toBe(true);
      expect(response.body.resultData).toHaveProperty('id');
      expect(response.body.resultData.userId).toBe(createdUserId);
      createdRiderId = response.body.resultData.id;
    });

    it('should get a rider by id', async () => {
      const response = await request(app.getHttpServer())
        .get(`/api/rider/${createdRiderId}`)
        .expect(200);

      expect(response.body.succeeded).toBe(true);
      expect(response.body.resultData.id).toBe(createdRiderId);
      expect(response.body.resultData.userId).toBe(createdUserId);
    });

    it('should return 404 for a non-existent rider id', async () => {
      await request(app.getHttpServer())
        .get('/api/rider/00000000-0000-0000-0000-000000000000')
        .expect(404);
    });

    it('should get all riders', async () => {
      const response = await request(app.getHttpServer())
        .get('/api/rider')
        .expect(200);

      expect(response.body.succeeded).toBe(true);
      expect(Array.isArray(response.body.resultData)).toBe(true);
      expect(response.body.resultData.length).toBeGreaterThan(0);
    });

    it('should get a rider by user id', async () => {
      const response = await request(app.getHttpServer())
        .get(`/api/rider/user/${createdUserId}`)
        .expect(200);

      expect(response.body.succeeded).toBe(true);
      expect(response.body.resultData.userId).toBe(createdUserId);
      expect(response.body.resultData.id).toBe(createdRiderId);
    });

    it('should return 404 for a non-existent user id', async () => {
      await request(app.getHttpServer())
        .get('/api/rider/user/00000000-0000-0000-0000-000000000000')
        .expect(404);
    });

    it('should update a rider', async () => {
      const updateData = {
        preferredLanguage: 'fr',
      };

      const response = await request(app.getHttpServer())
        .put(`/api/rider/${createdRiderId}`)
        .send(updateData)
        .expect(200);
      expect(response.body.succeeded).toBe(true);
      expect(response.body.resultData.preferredLanguage).toBe('fr');
    });

    it('should delete a rider', async () => {
      const response = await request(app.getHttpServer())
        .delete(`/api/rider/${createdRiderId}`)
        .expect(200);

      expect(response.body.succeeded).toBe(true);
    });

    it('should return 404 when trying to get a deleted rider', async () => {
      await request(app.getHttpServer())
        .get(`/api/rider/${createdRiderId}`)
        .expect(404);
    });
  });
});