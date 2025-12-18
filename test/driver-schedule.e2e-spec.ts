import { Test, TestingModule } from '@nestjs/testing';
import { ValidationPipe } from '@nestjs/common';
import { AppModule } from '../src/app.module';
import { FastifyAdapter, NestFastifyApplication } from '@nestjs/platform-fastify';
import { CreateDriverScheduleDto } from 'src/application/DTO/driver-schedule/create-driver-schedule.dto';
import request from 'supertest';

describe('DriverScheduleController (e2e)', () => {
  jest.setTimeout(30000);

  let app: NestFastifyApplication;
  let createdDriverId: string;
  let createdScheduleId: string;

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication<NestFastifyApplication>(new FastifyAdapter());
    app.setGlobalPrefix('api');
    app.useGlobalPipes(new ValidationPipe());
    await app.init();
    await app.getHttpAdapter().getInstance().ready();

    // Create a user and driver for the tests
    const userEmail = `schedule_user_${Date.now()}@example.com`;
    const userResponse = await request(app.getHttpServer())
      .post('/api/user')
      .send({
        email: userEmail,
        phone: `081${Math.floor(Math.random() * 1000000000)}`,
        password: 'Password123!',
        firstName: 'Schedule',
        lastName: 'Driver',
        userType: 'DRIVER',
      });
    expect(userResponse.statusCode).toBe(201);
    const userId = userResponse.body.resultData.id;

    const driverResponse = await request(app.getHttpServer())
      .post('/api/driver/company')
      .send({
        userId: userId,
        licenseNumber: `SCH-LIC-${Date.now()}`,
        licenseExpiry: new Date(),
      });
    expect(driverResponse.statusCode).toBe(201);
    createdDriverId = driverResponse.body.resultData.id;
  });

  afterAll(async () => {
    await app.close();
  });

  describe('/api/driver-schedule', () => {
    it('should create a new driver schedule', async () => {
      const scheduleData: CreateDriverScheduleDto = {
        driverId: createdDriverId,
        dayOfWeek: 1, // Monday
        startTime: '09:00',
        endTime: '17:00',
        isActive: true,
      };

      const response = await request(app.getHttpServer())
        .post('/api/driver-schedule')
        .send(scheduleData)
        .expect(201);

      expect(response.body.succeeded).toBe(true);
      expect(response.body.resultData).toHaveProperty('id');
      expect(response.body.resultData.driverId).toBe(createdDriverId);
      createdScheduleId = response.body.resultData.id;
    });

    it('should get a driver schedule by id', async () => {
      const response = await request(app.getHttpServer())
        .get(`/api/driver-schedule/${createdScheduleId}`)
        .expect(200);

      expect(response.body.succeeded).toBe(true);
      expect(response.body.resultData.id).toBe(createdScheduleId);
    });

    it('should get driver schedules by driver id', async () => {
      const response = await request(app.getHttpServer())
        .get(`/api/driver-schedule/driver/${createdDriverId}`)
        .expect(200);

      expect(response.body.succeeded).toBe(true);
      expect(Array.isArray(response.body.resultData)).toBe(true);
      expect(response.body.resultData.length).toBeGreaterThan(0);
    });

    it('should get all driver schedules', async () => {
      const response = await request(app.getHttpServer())
        .get('/api/driver-schedule')
        .expect(200);

      expect(response.body.succeeded).toBe(true);
      expect(Array.isArray(response.body.resultData)).toBe(true);
    });

    it('should update a driver schedule', async () => {
      const updateData = {
        isActive: false,
      };

      const response = await request(app.getHttpServer())
        .put(`/api/driver-schedule/${createdScheduleId}`)
        .send(updateData)
        .expect(200);

      expect(response.body.succeeded).toBe(true);
      expect(response.body.resultData.isActive).toBe(false);
    });

    it('should delete a driver schedule', async () => {
      const response = await request(app.getHttpServer())
        .delete(`/api/driver-schedule/${createdScheduleId}`)
        .expect(200);

      expect(response.body.succeeded).toBe(true);
    });

    it('should return 404 when trying to get a deleted driver schedule', async () => {
      await request(app.getHttpServer())
        .get(`/api/driver-schedule/${createdScheduleId}`)
        .expect(404);
    });
  });
});
