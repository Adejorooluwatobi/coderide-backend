import { Test, TestingModule } from '@nestjs/testing';
import { ValidationPipe } from '@nestjs/common';
import { FastifyAdapter, NestFastifyApplication } from '@nestjs/platform-fastify';
import { TestAppModule } from './test-app.module';
import { CreateCompanyDriverDto } from 'src/application/DTO/driver/create-company-driver.dto';
import request from 'supertest';

describe('DriverController (e2e)', () => {
  jest.setTimeout(30000);
  let app: NestFastifyApplication;
  let createdUserId: string;
  let createdDriverId: string;
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

    // Create a user to be associated with the driver
    const userEmail = `driver_user_${Date.now()}@example.com`;
    const userResponse = await request(app.getHttpServer())
      .post('/api/user')
      .send({
        email: userEmail,
        phone: `081${Math.floor(Math.random() * 1000000000)}`,
        password: 'Password123!',
        firstName: 'Test',
        lastName: 'DriverUser',
        userType: 'DRIVER',
      });

    expect(userResponse.statusCode).toBe(201);
    createdUserId = userResponse.body.resultData.id;

    // Login as the user to get a token for authenticated endpoints
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

  describe('/api/driver', () => {
    it('should create a new company driver', async () => {
      const driverData: CreateCompanyDriverDto = {
        userId: createdUserId,
        licenseNumber: `LIC-${Date.now()}`,
        licenseExpiry: new Date(Date.now() + 365 * 24 * 60 * 60 * 1000), // 1 year from now
      };

      const response = await request(app.getHttpServer())
        .post('/api/driver/company')
        .send(driverData)
        .expect(201);

      expect(response.body.succeeded).toBe(true);
      expect(response.body.resultData).toHaveProperty('id');
      expect(response.body.resultData.userId).toBe(createdUserId);
      createdDriverId = response.body.resultData.id;
    });

    it('should get a driver by id', async () => {
      const response = await request(app.getHttpServer())
        .get(`/api/driver/${createdDriverId}`)
        .expect(200);

      expect(response.body.succeeded).toBe(true);
      expect(response.body.resultData.id).toBe(createdDriverId);
    });

    it('should return 404 for a non-existent driver id', async () => {
      await request(app.getHttpServer())
        .get('/api/driver/00000000-0000-0000-0000-000000000000')
        .expect(404);
    });

    it('should get all drivers', async () => {
      const response = await request(app.getHttpServer())
        .get('/api/driver')
        .expect(200);

      expect(response.body.succeeded).toBe(true);
      expect(Array.isArray(response.body.resultData)).toBe(true);
      expect(response.body.resultData.length).toBeGreaterThan(0);
    });

    it('should get a driver by user id', async () => {
      const response = await request(app.getHttpServer())
        .get(`/api/driver/user/${createdUserId}`)
        .expect(200);

      expect(response.body.succeeded).toBe(true);
      expect(response.body.resultData.userId).toBe(createdUserId);
    });

    it('should update a driver', async () => {
      const updateData = {
        isOnline: true,
        latitude: 6.5,
        longitude: 3.4
      };

      const response = await request(app.getHttpServer())
        .put(`/api/driver/${createdDriverId}`)
        .set('Authorization', `Bearer ${authToken}`)
        .send(updateData)
        .expect(200);

      expect(response.body.succeeded).toBe(true);
      expect(response.body.resultData.isOnline).toBe(true);
      expect(response.body.resultData.latitude).toBe(6.5);
    });

    it('should create a new driver application', async () => {
        // Create a new user for this test
        const newUserEmail = `new_driver_user_${Date.now()}@example.com`;
        const newUserResponse = await request(app.getHttpServer())
            .post('/api/user')
            .send({
                email: newUserEmail,
                phone: `081${Math.floor(Math.random() * 1000000000)}`,
                password: 'Password123!',
                firstName: 'New',
                lastName: 'DriverUser',
                userType: 'DRIVER',
            });
        expect(newUserResponse.statusCode).toBe(201);

        const newLoginResponse = await request(app.getHttpServer())
            .post('/api/auth/user/login')
            .send({
                email: newUserEmail,
                password: 'Password123!',
            });
        expect(newLoginResponse.statusCode).toBe(200);
        const newAuthToken = newLoginResponse.body.accessToken;

        const applicationData = {
            licenseNumber: `APP-LIC-${Date.now()}`,
            licenseExpiry: new Date(Date.now() + 365 * 24 * 60 * 60 * 1000), // 1 year from now
            driversLicenseUrl: 'http://example.com/license.jpg',
            profilePhotoUrl: 'http://example.com/photo.jpg',
            vehicle: {
                plateNumber: `PLATE-${Date.now()}`
            }
        };

        const response = await request(app.getHttpServer())
            .post('/api/driver/apply')
            .set('Authorization', `Bearer ${newAuthToken}`)
            .send(applicationData);

        expect(response.statusCode).toBe(201);
        expect(response.body.succeeded).toBe(true);
        expect(response.body.resultData).toHaveProperty('id');
        expect(response.body.resultData.licenseNumber).toBe(applicationData.licenseNumber);
    });

    it('should delete a driver', async () => {
        const response = await request(app.getHttpServer())
            .delete(`/api/driver/${createdDriverId}`)
            .set('Authorization', `Bearer ${authToken}`)
            .expect(200);

      expect(response.body.succeeded).toBe(true);
    });

    it('should return 404 when trying to get a deleted driver', async () => {
        await request(app.getHttpServer())
            .get(`/api/driver/${createdDriverId}`)
            .expect(404);
    });
  });

});
