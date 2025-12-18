import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication, ValidationPipe } from '@nestjs/common';
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
        .post('/api/auth/user/register')
        .send(userData)
        .expect(201);

      expect(response.text).toBe('User registered successfully');
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
        .post('/api/auth/user/register')
        .send(userData)
        .expect(201);

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
        .expect(401);
    });
  });

  describe('/api/auth/admin', () => {
    it('should register a new admin', async () => {
      const adminUsername = `admin_${Date.now()}`;
      const adminData = {
        username: adminUsername,
        password: 'AdminPassword123!',
      };

      const response = await request(app.getHttpServer())
        .post('/api/auth/admin/register')
        .send(adminData)
        .expect(201);

      expect(response.text).toBe('Admin registered successfully');
    });

    it('should login an admin', async () => {
      // First create an admin
      const adminUsername = `login_admin_${Date.now()}`;
      const adminData = {
        username: adminUsername,
        password: 'AdminPassword123!',
      };

      await request(app.getHttpServer())
        .post('/api/auth/admin/register')
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
        .expect(401);
    });
  });
});