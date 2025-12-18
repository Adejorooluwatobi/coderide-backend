import { Test, TestingModule } from '@nestjs/testing';
import { ValidationPipe } from '@nestjs/common';
import { FastifyAdapter, NestFastifyApplication } from '@nestjs/platform-fastify';
import request from 'supertest';
import { TestAppModule } from './test-app.module';

describe('AuthController (e2e)', () => {
  let app: NestFastifyApplication;
  let createdUserId: string;
  let createdAdminId: string;

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [TestAppModule],
    }).compile();

    app = moduleFixture.createNestApplication<NestFastifyApplication>(new FastifyAdapter());
    app.setGlobalPrefix('api');
    app.useGlobalPipes(new ValidationPipe());
    await app.init();
    await app.getHttpAdapter().getInstance().ready();
  });

  afterAll(async () => {
    await app.close();
  });

  describe('/api/auth/user', () => {
    it('should register a new user', async () => {
      const userEmail = `test_user_${Date.now()}@example.com`;
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
    });

    it('should login a user', async () => {
      // First create a user
      const userEmail = `login_user_${Date.now()}@example.com`;
      const userData = {
        email: userEmail,
        phone: `082${Math.floor(Math.random() * 1000000000)}`,
        password: 'Password123!',
        firstName: 'Login',
        lastName: 'User',
        userType: 'RIDER',
      };

      await request(app.getHttpServer())
        .post('/api/user')
        .send(userData)
        .expect(201); // Assuming user creation is successful

      // Then login
      const loginData = {
        email: userEmail,
        password: 'Password123!',
      };

      const response = await request(app.getHttpServer())
        .post('/api/auth/user/login')
        .send(loginData)
        .expect(200);

      expect(response.body).toHaveProperty('accessToken');
      expect(response.body).toHaveProperty('isActive');
      expect(response.body).toHaveProperty('displayName');
      expect(response.body).toHaveProperty('role');
    });

    it('should fail login with wrong credentials', async () => {
      const loginData = {
        email: 'nonexistent@example.com',
        password: 'wrongpassword',
      };

      await request(app.getHttpServer())
        .post('/api/auth/user/login')
        .send(loginData)
        .expect(404);
    });
  });

  describe('/api/auth/admin', () => {
    it('should register a new admin', async () => {
      const adminUsername = `admin_${Date.now()}`;
      const adminData = {
        username: adminUsername,
        password: 'AdminPassword123!',
        permissions: 1, // MANAGE_SYSTEM_SETTINGS
      };

      const response = await request(app.getHttpServer())
        .post('/api/admin')
        .send(adminData)
        .expect(201);

      expect(response.body.succeeded).toBe(true);
      expect(response.body.resultData).toHaveProperty('id');
    });

    it('should login an admin', async () => {
      // First create an admin
      const adminUsername = `login_admin_${Date.now()}`;
      const adminData = {
        username: adminUsername,
        password: 'AdminPassword123!',
        permissions: 1,
      };

      await request(app.getHttpServer())
        .post('/api/admin')
        .send(adminData)
        .expect(201);

      // Then login
      const loginData = {
        username: adminUsername,
        password: 'AdminPassword123!',
      };

      const response = await request(app.getHttpServer())
        .post('/api/auth/admin/login')
        .send(loginData)
        .expect(200);

      expect(response.body).toHaveProperty('accessToken');
      expect(response.body).toHaveProperty('isActive');
      expect(response.body).toHaveProperty('displayName');
      expect(response.body).toHaveProperty('role');
      expect(response.body).toHaveProperty('permissions');
    });

    it('should fail admin login with wrong credentials', async () => {
      const loginData = {
        username: 'nonexistentadmin',
        password: 'wrongpassword',
      };

      await request(app.getHttpServer())
        .post('/api/auth/admin/login')
        .send(loginData)
        .expect(404);
    });
  });
});