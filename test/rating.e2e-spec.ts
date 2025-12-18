import { Test, TestingModule } from '@nestjs/testing';
import { ValidationPipe } from '@nestjs/common';
import request from 'supertest';
import { AppModule } from '../src/app.module';
import { FastifyAdapter, NestFastifyApplication } from '@nestjs/platform-fastify';
import { UserType } from 'src/domain/enums/user-type.enum';

describe('RatingController (e2e)', () => {
  let app: NestFastifyApplication;
  let riderId: string;
  let driverId: string;
  let rideId: string;
  let ratingId: string;

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication<NestFastifyApplication>(new FastifyAdapter());
    app.setGlobalPrefix('api');
    app.useGlobalPipes(new ValidationPipe());
    await app.init();

    // Create Rider User and Rider Profile
    const riderUserRes = await request(app.getHttpServer()).post('/api/user').send({
      email: `rating_rider_${Date.now()}@example.com`,
      password: 'Password123!',
      userType: UserType.RIDER,
    });
    const riderUserId = riderUserRes.body.resultData.id;
    const riderRes = await request(app.getHttpServer()).post('/api/rider').send({ userId: riderUserId });
    riderId = riderRes.body.resultData.id;

    // Create Driver User and Driver Profile
    const driverUserRes = await request(app.getHttpServer()).post('/api/user').send({
      email: `rating_driver_${Date.now()}@example.com`,
      password: 'Password123!',
      userType: UserType.DRIVER,
    });
    const driverUserId = driverUserRes.body.resultData.id;
    const driverRes = await request(app.getHttpServer()).post('/api/driver/company').send({
      userId: driverUserId,
      licenseNumber: `RATE-LIC-${Date.now()}`,
    });
    driverId = driverRes.body.resultData.id;

    // Create a Ride
    const rideRes = await request(app.getHttpServer()).post('/api/ride').send({
      riderId: riderId,
      pickupAddress: 'A',
      destinationAddress: 'B',
    });
    rideId = rideRes.body.resultData.id;
  });

  afterAll(async () => {
    await app.close();
  });

  describe('/api/rating', () => {
    it('should create a new rating', async () => {
      const ratingData = {
        rideId: rideId,
        raterId: riderId,
        rateeId: driverId,
        rating: 5,
        comment: 'Excellent driver!',
      };

      const response = await request(app.getHttpServer())
        .post('/api/rating')
        .send(ratingData)
        .expect(201);

      expect(response.body.succeeded).toBe(true);
      expect(response.body.resultData).toHaveProperty('id');
      ratingId = response.body.resultData.id;
      expect(response.body.resultData.rating).toBe(5);
    });

    it('should get a rating by id', async () => {
      const response = await request(app.getHttpServer())
        .get(`/api/rating/${ratingId}`)
        .expect(200);
      expect(response.body.resultData.id).toBe(ratingId);
    });

    it('should get ratings for a specific ride', async () => {
      const response = await request(app.getHttpServer())
        .get(`/api/rating/ride/${rideId}`)
        .expect(200);
      expect(Array.isArray(response.body.resultData)).toBe(true);
      expect(response.body.resultData.length).toBeGreaterThan(0);
    });

    it('should get ratings given by a user (rater)', async () => {
      const response = await request(app.getHttpServer())
        .get(`/api/rating/rater/${riderId}`)
        .expect(200);
      expect(Array.isArray(response.body.resultData)).toBe(true);
      expect(response.body.resultData.length).toBeGreaterThan(0);
    });

    it('should get ratings received by a user (ratee)', async () => {
      const response = await request(app.getHttpServer())
        .get(`/api/rating/ratee/${driverId}`)
        .expect(200);
      expect(Array.isArray(response.body.resultData)).toBe(true);
      expect(response.body.resultData.length).toBeGreaterThan(0);
    });
  });
});