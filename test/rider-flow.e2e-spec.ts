import { Test, TestingModule } from '@nestjs/testing';
import { ValidationPipe } from '@nestjs/common';
import request from 'supertest';
import { AppModule } from './../src/app.module';
import { FastifyAdapter, NestFastifyApplication } from '@nestjs/platform-fastify';

describe('Complete Rider Flow (e2e)', () => {
  let app: NestFastifyApplication;
  let userId: string;
  let riderId: string;
  let rideId: string;

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication<NestFastifyApplication>(new FastifyAdapter());
    app.setGlobalPrefix('api');
    app.useGlobalPipes(new ValidationPipe());
    await app.init();
  });

  afterAll(async () => {
    await app.close();
  });

  it('Step 1: Create rider user', async () => {
    const userData = {
      email: `rider${Date.now()}@example.com`,
      phone: `081${Math.floor(Math.random() * 1000000000)}`,
      password: 'Password123!',
      firstName: 'John',
      lastName: 'Rider',
      userType: 'RIDER',
    };

    const response = await request(app.getHttpServer())
      .post('/api/user')
      .send(userData)
      .expect(201);

    userId = response.body.resultData.id;
    expect(userId).toBeDefined();
  });

  it('Step 2: Create rider profile', async () => {
    const riderData = {
      userId: userId,
      preferredLanguage: 'en',
      savedLocations: {
        home: { address: '123 Home St', latitude: 6.5244, longitude: 3.3792 },
        work: { address: '456 Work Ave', latitude: 6.4281, longitude: 3.4219 },
      },
    };

    const response = await request(app.getHttpServer())
      .post('/api/rider')
      .send(riderData)
      .expect(201);

    riderId = response.body.resultData.id;
    expect(riderId).toBeDefined();
  });

  it('Step 3: Request fare estimate', async () => {
    const fareData = {
      riderId: riderId,
      pickupLatitude: 6.5244,
      pickupLongitude: 3.3792,
      destinationLatitude: 6.4281,
      destinationLongitude: 3.4219,
      estimatedDistance: 15.5,
      estimatedDuration: 30,
      estimatedPrice: 2500,
      vehicleCategory: 'ECONOMY',
    };

    const response = await request(app.getHttpServer())
      .post('/api/fare-estimate')
      .send(fareData)
      .expect(201);

    expect(response.body.resultData.estimatedPrice).toBe(2500);
  });

  it('Step 4: Create ride request', async () => {
    const rideData = {
      riderId: riderId,
      pickupLatitude: 6.5244,
      pickupLongitude: 3.3792,
      pickupAddress: '123 Home Street, Lagos',
      destinationLatitude: 6.4281,
      destinationLongitude: 3.4219,
      destinationAddress: '456 Work Avenue, Lagos',
      rideType: 'ECONOMY',
      estimatedDistance: 15.5,
      estimatedDuration: 30,
      estimatedPrice: 2500,
    };

    const response = await request(app.getHttpServer())
      .post('/api/ride')
      .send(rideData)
      .expect(201);

    rideId = response.body.resultData.id;
    expect(rideId).toBeDefined();
    expect(response.body.resultData.status).toBe('REQUESTED');
  });

  it('Step 5: Get ride details', async () => {
    const response = await request(app.getHttpServer())
      .get(`/api/ride/${rideId}`)
      .expect(200);

    expect(response.body.resultData.riderId).toBe(riderId);
    expect(response.body.resultData.status).toBe('REQUESTED');
  });

  it('Step 6: Get all rider rides', async () => {
    const response = await request(app.getHttpServer())
      .get(`/api/ride/rider/${riderId}`)
      .expect(200);

    expect(Array.isArray(response.body.resultData)).toBe(true);
    expect(response.body.resultData.length).toBeGreaterThan(0);
  });
});