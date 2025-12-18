import { Test, TestingModule } from '@nestjs/testing';
import { ValidationPipe } from '@nestjs/common';
import request from 'supertest';
import { AppModule } from '../src/app.module';
import { FastifyAdapter, NestFastifyApplication } from '@nestjs/platform-fastify';
import { RideStatus } from 'src/domain/enums/ride-status.enum';

describe('RideController (e2e)', () => {
  let app: NestFastifyApplication;
  let riderId: string;
  let driverId: string;
  let rideId: string;

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication<NestFastifyApplication>(new FastifyAdapter());
    app.setGlobalPrefix('api');
    app.useGlobalPipes(new ValidationPipe());
    await app.init();
    await app.getHttpAdapter().getInstance().ready();

    // Create a rider
    const riderUserRes = await request(app.getHttpServer()).post('/api/user').send({
      email: `ride_rider_${Date.now()}@example.com`,
      phone: `081${Math.floor(Math.random() * 1000000000)}`,
      password: 'Password123!',
      firstName: 'Ride',
      lastName: 'Rider',
      userType: 'RIDER',
    });
    expect(riderUserRes.statusCode).toBe(201);
    const riderUserId = riderUserRes.body.resultData.id;
    const riderRes = await request(app.getHttpServer()).post('/api/rider').send({ userId: riderUserId });
    expect(riderRes.statusCode).toBe(201);
    riderId = riderRes.body.resultData.id;

    // Create a driver
    const driverUserRes = await request(app.getHttpServer()).post('/api/user').send({
      email: `ride_driver_${Date.now()}@example.com`,
      phone: `081${Math.floor(Math.random() * 1000000000)}`,
      password: 'Password123!',
      firstName: 'Ride',
      lastName: 'Driver',
      userType: 'DRIVER',
    });
    expect(driverUserRes.statusCode).toBe(201);
    const driverUserId = driverUserRes.body.resultData.id;
    const driverRes = await request(app.getHttpServer()).post('/api/driver/company').send({
      userId: driverUserId,
      licenseNumber: `RIDE-LIC-${Date.now()}`,
    });
    expect(driverRes.statusCode).toBe(201);
    driverId = driverRes.body.resultData.id;
  });

  afterAll(async () => {
    await app.close();
  });

  describe('/api/ride', () => {
    it('should create a new ride request', async () => {
      const rideData = {
        riderId: riderId,
        pickupAddress: '123 Pickup Lane',
        destinationAddress: '456 Dropoff Drive',
        pickupLatitude: 6.5,
        pickupLongitude: 3.4,
        destinationLatitude: 6.6,
        destinationLongitude: 3.5,
      };

      const response = await request(app.getHttpServer())
        .post('/api/ride')
        .send(rideData)
        .expect(201);

      expect(response.body.succeeded).toBe(true);
      rideId = response.body.resultData.id;
      expect(rideId).toBeDefined();
      expect(response.body.resultData.status).toBe(RideStatus.REQUESTED);
    });

    it('should get a ride by its ID', async () => {
      const response = await request(app.getHttpServer())
        .get(`/api/ride/${rideId}`)
        .expect(200);

      expect(response.body.resultData.id).toBe(rideId);
    });

    it('should accept a ride', async () => {
      const response = await request(app.getHttpServer())
        .put(`/api/ride/${rideId}/accept`)
        .send({ driverId: driverId })
        .expect(200);

      expect(response.body.resultData.status).toBe(RideStatus.ACCEPTED);
      expect(response.body.resultData.driverId).toBe(driverId);
    });

    it('should start a ride', async () => {
      const response = await request(app.getHttpServer())
        .put(`/api/ride/${rideId}/start`)
        .expect(200);

      expect(response.body.resultData.status).toBe(RideStatus.IN_PROGRESS);
      expect(response.body.resultData.startTime).toBeDefined();
    });

    it('should complete a ride', async () => {
      const response = await request(app.getHttpServer())
        .put(`/api/ride/${rideId}/complete`)
        .expect(200);

      expect(response.body.resultData.status).toBe(RideStatus.COMPLETED);
      expect(response.body.resultData.endTime).toBeDefined();
    });

    it('should get rides by status', async () => {
        const response = await request(app.getHttpServer())
            .get(`/api/ride/status/${RideStatus.COMPLETED}`)
            .expect(200);

        expect(Array.isArray(response.body.resultData)).toBe(true);
        expect(response.body.resultData.some(r => r.id === rideId)).toBe(true);
    });

    it('should cancel a ride', async () => {
        // Create a new ride to cancel
        const rideToCancelRes = await request(app.getHttpServer()).post('/api/ride').send({ riderId, pickupAddress: 'C', destinationAddress: 'D' });
        const rideToCancelId = rideToCancelRes.body.resultData.id;

        const response = await request(app.getHttpServer())
            .put(`/api/ride/${rideToCancelId}/cancel`)
            .expect(200);

        expect(response.body.resultData.status).toBe(RideStatus.CANCELLED);
    });
  });
});