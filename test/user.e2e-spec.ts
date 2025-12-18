import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import * as request from 'supertest';
import { AppModule } from './../src/app.module';

describe('UserController (e2e)', () => {
  let app: INestApplication;
  let createdUserId: string;
  let userEmail: string;

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
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
});