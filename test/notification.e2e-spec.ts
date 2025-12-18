import { Test, TestingModule } from '@nestjs/testing';
import { ValidationPipe } from '@nestjs/common';
import { AppModule } from '../src/app.module';
import { FastifyAdapter, NestFastifyApplication } from '@nestjs/platform-fastify';
import { CreateNotificationDto } from 'src/application/DTO/notification/create-notification.dto';
import { NotificationType } from 'src/domain/enums/notification.enum';
import request from 'supertest';

describe('NotificationController (e2e)', () => {
  jest.setTimeout(30000);

  let app: NestFastifyApplication;
  let createdUserId: string;
  let createdNotificationId: string;

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication<NestFastifyApplication>(new FastifyAdapter());
    app.setGlobalPrefix('api');
    app.useGlobalPipes(new ValidationPipe());
    await app.init();

    // Create a user for the tests
    const userEmail = `notif_user_${Date.now()}@example.com`;
    const userResponse = await request(app.getHttpServer())
      .post('/api/user')
      .send({
        email: userEmail,
        phone: `081${Math.floor(Math.random() * 1000000000)}`,
        password: 'Password123!',
        firstName: 'Notif',
        lastName: 'User',
        userType: 'RIDER',
      });

    expect(userResponse.statusCode).toBe(201);
    createdUserId = userResponse.body.resultData.id;
  });

  afterAll(async () => {
    await app.close();
  });

  describe('POST /api/notification', () => {
    it('should create a new notification', async () => {
      const notificationData: CreateNotificationDto = {
        userId: createdUserId,
        title: 'Test Notification',
        message: 'This is a test notification.',
        type: NotificationType.RIDE_UPDATE,
        isRead: false,
      };

      const response = await request(app.getHttpServer())
        .post('/api/notification')
        .send(notificationData)
        .expect(201);

      expect(response.body.succeeded).toBe(true);
      expect(response.body.resultData).toHaveProperty('id');
      expect(response.body.resultData.userId).toBe(createdUserId);
      createdNotificationId = response.body.resultData.id;
    });
  });

  describe('GET /api/notification/:id', () => {
    it('should get a notification by id', async () => {
      const res = await request(app.getHttpServer())
        .get(`/api/notification/${createdNotificationId}`)
        .expect(200);

      expect(res.body.succeeded).toBe(true);
      expect(res.body.resultData.id).toBe(createdNotificationId);
    });
  });

    describe('GET /api/notification/user/:userId', () => {
        it('should get notifications by user id', async () => {
            const response = await request(app.getHttpServer())
                .get(`/api/notification/user/${createdUserId}`)
                .expect(200);

            expect(response.body.succeeded).toBe(true);
            expect(Array.isArray(response.body.resultData)).toBe(true);
            expect(response.body.resultData.length).toBeGreaterThan(0);
        });
    });

    describe('GET /api/notification', () => {
        it('should get all notifications', async () => {
            const response = await request(app.getHttpServer())
                .get('/api/notification')
                .expect(200);

            expect(response.body.succeeded).toBe(true);
            expect(Array.isArray(response.body.resultData)).toBe(true);
        });
    });

    describe('PUT /api/notification/:id', () => {
        it('should update a notification', async () => {
            const updateData = { isRead: true };

            const response = await request(app.getHttpServer())
                .put(`/api/notification/${createdNotificationId}`)
                .send(updateData)
                .expect(200);

            expect(response.body.succeeded).toBe(true);
            expect(response.body.resultData.isRead).toBe(true);
        });
    });

    describe('DELETE /api/notification/:id', () => {
        it('should delete a notification', async () => {
            const response = await request(app.getHttpServer())
                .delete(`/api/notification/${createdNotificationId}`)
                .expect(200);

            expect(response.body.succeeded).toBe(true);
        });

        it('should return 404 when trying to get a deleted notification', async () => {
            await request(app.getHttpServer())
                .get(`/api/notification/${createdNotificationId}`)
                .expect(404);
        });
    });
});
