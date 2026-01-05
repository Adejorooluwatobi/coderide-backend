import { Test, TestingModule } from '@nestjs/testing';
import { ValidationPipe } from '@nestjs/common';
import { AppModule } from '../src/app.module';
import { FastifyAdapter, NestFastifyApplication } from '@nestjs/platform-fastify';
import { CreateEarningDto } from 'src/application/DTO/earning/create-earning.dto';
import { PayoutStatus } from 'src/domain/enums/payout-status.enum';
import request from 'supertest';

describe('EarningController (e2e)', () => {
  jest.setTimeout(30000);

  let app: NestFastifyApplication;
  let createdDriverId: string;
  let createdRideId: string;
  let createdEarningId: string;

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
    const driverUserEmail = `earning_driver_${Date.now()}@example.com`;
    const driverUserResponse = await request(app.getHttpServer())
      .post('/api/user')
      .send({
        email: driverUserEmail,
        phone: `081${Math.floor(Math.random() * 1000000000)}`,
        password: 'Password123!',
        firstName: 'Earning',
        lastName: 'Driver',
        userType: 'DRIVER',
      });
    expect(driverUserResponse.statusCode).toBe(201);
    const driverUserId = driverUserResponse.body.resultData.id;

    const driverResponse = await request(app.getHttpServer())
      .post('/api/driver/company')
      .send({
        userId: driverUserId,
        licenseNumber: `EARN-LIC-${Date.now()}`,
        licenseExpiry: new Date(),
      });
    expect(driverResponse.statusCode).toBe(201);
    createdDriverId = driverResponse.body.resultData.id;

    // Create a user and rider for the tests
    const riderUserEmail = `earning_rider_${Date.now()}@example.com`;
    const riderUserResponse = await request(app.getHttpServer())
      .post('/api/user')
      .send({
        email: riderUserEmail,
        phone: `081${Math.floor(Math.random() * 1000000000)}`,
        password: 'Password123!',
        firstName: 'Earning',
        lastName: 'Rider',
        userType: 'RIDER',
      });
    expect(riderUserResponse.statusCode).toBe(201);
    const riderUserId = riderUserResponse.body.resultData.id;

    const riderResponse = await request(app.getHttpServer())
      .post('/api/rider')
      .send({ userId: riderUserId });
    expect(riderResponse.statusCode).toBe(201);
    const riderId = riderResponse.body.resultData.id;

    // Create a ride for the tests
    const rideResponse = await request(app.getHttpServer())
      .post('/api/ride')
      .send({
        riderId: riderId,
        pickupLatitude: 0,
        pickupLongitude: 0,
        destinationLatitude: 0,
        destinationLongitude: 0,
        pickupAddress: 'pickup',
        destinationAddress: 'destination',
        rideType: 'ECONOMY',
      });
    expect(rideResponse.statusCode).toBe(201);
    createdRideId = rideResponse.body.resultData.id;
  });

  afterAll(async () => {
    await app.close();
  });

  describe('/api/earning', () => {
    it('should create a new earning', async () => {
      const earningData: CreateEarningDto = {
        driverId: createdDriverId,
        rideId: createdRideId,
        grossAmount: 100,
        platformFee: 10,
        netAmount: 90,
        payoutStatus: PayoutStatus.PENDING,
      };

      const response = await request(app.getHttpServer())
        .post('/api/earning')
        .send(earningData)
        .expect(201);

      expect(response.body.succeeded).toBe(true);
      expect(response.body.resultData).toHaveProperty('id');
      expect(response.body.resultData.driverId).toBe(createdDriverId);
      createdEarningId = response.body.resultData.id;
    });

    it('should get an earning by id', async () => {
      const response = await request(app.getHttpServer())
        .get(`/api/earning/${createdEarningId}`)
        .expect(200);

      expect(response.body.succeeded).toBe(true);
      expect(response.body.resultData.id).toBe(createdEarningId);
    });

    it('should get an earning by ride id', async () => {
      const response = await request(app.getHttpServer())
        .get(`/api/earning/ride/${createdRideId}`)
        .expect(200);

      expect(response.body.succeeded).toBe(true);
      expect(response.body.resultData.rideId).toBe(createdRideId);
    });

    it('should get earnings by driver id', async () => {
      const response = await request(app.getHttpServer())
        .get(`/api/earning/driver/${createdDriverId}`)
        .expect(200);

      expect(response.body.succeeded).toBe(true);
      expect(Array.isArray(response.body.resultData)).toBe(true);
      expect(response.body.resultData.length).toBeGreaterThan(0);
    });

    it('should get all earnings', async () => {
      const response = await request(app.getHttpServer())
        .get('/api/earning')
        .expect(200);

      expect(response.body.succeeded).toBe(true);
      expect(Array.isArray(response.body.resultData)).toBe(true);
    });

    it('should update an earning', async () => {
      const updateData = {
        payoutStatus: PayoutStatus.PAID,
      };

      const response = await request(app.getHttpServer())
        .put(`/api/earning/${createdEarningId}`)
        .send(updateData)
        .expect(200);

      expect(response.body.succeeded).toBe(true);
      expect(response.body.resultData.payoutStatus).toBe(PayoutStatus.PAID);
    });

    it('should delete an earning', async () => {
      const response = await request(app.getHttpServer())
        .delete(`/api/earning/${createdEarningId}`)
        .expect(200);

      expect(response.body.succeeded).toBe(true);
    });

    it('should return 404 when trying to get a deleted earning', async () => {
      await request(app.getHttpServer())
        .get(`/api/earning/${createdEarningId}`)
        .expect(404);
    });
  });
});
