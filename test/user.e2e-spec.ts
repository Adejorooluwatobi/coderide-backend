import { Test, TestingModule } from '@nestjs/testing';
import { ValidationPipe } from '@nestjs/common';
import request from 'supertest';
import { AppModule } from './../src/app.module';
import { FastifyAdapter, NestFastifyApplication } from '@nestjs/platform-fastify';

describe('UserController (e2e)', () => {
  let app: NestFastifyApplication;
  let createdUserId: string;
  let userEmail: string;
  let authToken: string;

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication<NestFastifyApplication>(new FastifyAdapter());
    app.setGlobalPrefix('api');
    app.useGlobalPipes(new ValidationPipe());
    await app.init();
  });

  afterAll(async () => {
    await app.close();
  });

  describe('POST /api/user', () => {
    it('should create a new rider user', async () => {
      userEmail = `test${Date.now()}@example.com`;
      const userData = {
        email: userEmail,
        phone: `081${Math.floor(Math.random() * 1000000000)}`,
        password: 'Password123!',
        firstName: 'Test',
        lastName: 'User',
        userType: 'RIDER',
      };

      const response = await request(app.getHttpServer())
        .post('/api/user')
        .send(userData)
        .expect(201);

      expect(response.body.succeeded).toBe(true);
      expect(response.body.resultData).toHaveProperty('id');
      expect(response.body.resultData.email).toBe(userEmail);
      
      createdUserId = response.body.resultData.id;

      // Login to get auth token for subsequent tests
      const loginResponse = await request(app.getHttpServer())
        .post('/api/auth/user/login')
        .send({ email: userData.email, password: userData.password })
        .expect(200);

      expect(loginResponse.body.accessToken).toBeDefined();
      authToken = loginResponse.body.accessToken;
    });

    it('should not create user with duplicate email', async () => {
      const userData = {
        email: userEmail,
        phone: `082${Math.floor(Math.random() * 1000000000)}`,
        password: 'Password123!',
        firstName: 'Test',
        lastName: 'User',
        userType: 'RIDER',
      };

      await request(app.getHttpServer())
        .post('/api/user')
        .send(userData)
        .expect(409); // Conflict
    });
  });

  describe('GET /api/user/:id', () => {
    it('should get user by id', async () => {
      const response = await request(app.getHttpServer())
        .get(`/api/user/${createdUserId}`)
        .expect(200);

      expect(response.body.resultData.id).toBe(createdUserId);
      expect(response.body.resultData.email).toBe(userEmail);
    });

    it('should return 404 for non-existent user', async () => {
      await request(app.getHttpServer())
        .get('/api/user/00000000-0000-0000-0000-000000000000')
        .expect(404);
    });
  });

  describe('GET /api/user/email/:email', () => {
    it('should get user by email', async () => {
      const response = await request(app.getHttpServer())
        .get(`/api/user/email/${userEmail}`)
        .expect(200);

      expect(response.body.resultData.email).toBe(userEmail);
    });
  });

  describe('GET /api/user', () => {
    it('should get all users', async () => {
      const response = await request(app.getHttpServer())
        .get('/api/user')
        .expect(200);

      expect(Array.isArray(response.body.resultData)).toBe(true);
      expect(response.body.resultData.length).toBeGreaterThan(0);
    });
  });

  describe('PUT /api/user/:id', () => {
    it('should update a user', async () => {
      const updatedData = {
        firstName: 'Updated',
        lastName: 'Name',
      };

      const response = await request(app.getHttpServer())
        .put(`/api/user/${createdUserId}`)
        .set('Authorization', `Bearer ${authToken}`)
        .send(updatedData)
        .expect(200);

      expect(response.body.resultData.firstName).toBe('Updated');
      expect(response.body.resultData.lastName).toBe('Name');
    });
  });

  describe('DELETE /api/user/:id', () => {
    it('should delete a user', async () => {
      await request(app.getHttpServer())
        .delete(`/api/user/${createdUserId}`)
        .set('Authorization', `Bearer ${authToken}`)
        .expect(200);
    });

    it('should return 404 for the deleted user', async () => {
      await request(app.getHttpServer()).get(`/api/user/${createdUserId}`).expect(404);
    });
  });
});