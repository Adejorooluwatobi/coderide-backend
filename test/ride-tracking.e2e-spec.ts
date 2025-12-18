import { Test, TestingModule } from '@nestjs/testing';
import { ValidationPipe } from '@nestjs/common';
import request from 'supertest';
import { AppModule } from '../src/app.module';
import { FastifyAdapter, NestFastifyApplication } from '@nestjs/platform-fastify';

describe('RideTrackingController (e2e)', () => {
  let app: NestFastifyApplication;
  let rideId: string;
  let trackingRecordId: string;

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication<NestFastifyApplication>(new FastifyAdapter());
    app.setGlobalPrefix('api');
    app.useGlobalPipes(new ValidationPipe());
    await app.init();

    // Create a user and rider
    const userRes = await request(app.getHttpServer()).post('/api/user').send({
      email: `tracking_user_${Date.now()}@example.com`,
      password: 'Password123!',
    });
    const userId = userRes.body.resultData.id;
    const riderRes = await request(app.getHttpServer()).post('/api/rider').send({ userId });
    const riderId = riderRes.body.resultData.id;

    // Create a ride to track
    const rideRes = await request(app.getHttpServer()).post('/api/ride').send({
      riderId,
      pickupAddress: 'A',
      destinationAddress: 'B',
    });
    rideId = rideRes.body.resultData.id;
  });

  afterAll(async () => {
    await app.close();
  });

  describe('/api/ride-tracking', () => {
    it('should create a new ride tracking record', async () => {
      const trackingData = {
        rideId: rideId,
        latitude: 6.5244,
        longitude: 3.3792,
        timestamp: new Date(),
      };

      const response = await request(app.getHttpServer())
        .post('/api/ride-tracking')
        .send(trackingData)
        .expect(201);

      expect(response.body.succeeded).toBe(true);
      trackingRecordId = response.body.resultData.id;
      expect(trackingRecordId).toBeDefined();
      expect(response.body.resultData.latitude).toBe(6.5244);
    });

    it('should get tracking history for a ride', async () => {
      // Add another point to have a history
      await request(app.getHttpServer()).post('/api/ride-tracking').send({
        rideId: rideId,
        latitude: 6.5255,
        longitude: 3.3803,
        timestamp: new Date(),
      });

      const response = await request(app.getHttpServer())
        .get(`/api/ride-tracking/ride/${rideId}`)
        .expect(200);

      expect(Array.isArray(response.body.resultData)).toBe(true);
      expect(response.body.resultData.length).toBeGreaterThan(1);
    });

    it('should get the latest location for a ride', async () => {
      const response = await request(app.getHttpServer())
        .get(`/api/ride-tracking/ride/${rideId}/latest`)
        .expect(200);

      expect(response.body.succeeded).toBe(true);
      expect(response.body.resultData).toHaveProperty('id');
      expect(response.body.resultData.latitude).toBe(6.5255);
    });
  });
});