import { Test, TestingModule } from '@nestjs/testing';
import { ValidationPipe } from '@nestjs/common';
import { AppModule } from '../src/app.module';
import { FastifyAdapter, NestFastifyApplication } from '@nestjs/platform-fastify';
import { CreateFareEstimateDto } from 'src/application/DTO/fare-estimate/create-fare-estimate.dto';
import { VehicleCategory } from 'src/domain/enums/vehicle-category.enum';
import request from 'supertest';

describe('FareEstimateController (e2e)', () => {
  jest.setTimeout(30000);

  let app: NestFastifyApplication;
  let createdRiderId: string;
  let createdFareEstimateId: string;

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication<NestFastifyApplication>(new FastifyAdapter());
    app.setGlobalPrefix('api');
    app.useGlobalPipes(new ValidationPipe());
    await app.init();

    // Create a user and rider for the tests
    const riderUserEmail = `fare_rider_${Date.now()}@example.com`;
    const riderUserResponse = await request(app.getHttpServer())
      .post('/api/user')
      .send({
        email: riderUserEmail,
        phone: `081${Math.floor(Math.random() * 1000000000)}`,
        password: 'Password123!',
        firstName: 'Fare',
        lastName: 'Rider',
        userType: 'RIDER',
      });
    expect(riderUserResponse.statusCode).toBe(201);
    const riderUserId = riderUserResponse.body.resultData.id;

    const riderResponse = await request(app.getHttpServer())
      .post('/api/rider')
      .send({
        userId: riderUserId,
      });
    expect(riderResponse.statusCode).toBe(201);
    createdRiderId = riderResponse.body.resultData.id;
  });

  afterAll(async () => {
    await app.close();
  });

  describe('/api/fare-estimate', () => {
    it('should create a new fare estimate', async () => {
      const fareEstimateData: CreateFareEstimateDto = {
        riderId: createdRiderId,
        pickupLatitude: 10,
        pickupLongitude: 20,
        destinationLatitude: 30,
        destinationLongitude: 40,
        estimatedPrice: 100,
        estimatedDistance: 10,
        estimatedDuration: 5,
        vehicleCategory: VehicleCategory.ECONOMY,
      };

      const response = await request(app.getHttpServer())
        .post('/api/fare-estimate')
        .send(fareEstimateData)
        .expect(201);

      expect(response.body.succeeded).toBe(true);
      expect(response.body.resultData).toHaveProperty('id');
      expect(response.body.resultData.riderId).toBe(createdRiderId);
      createdFareEstimateId = response.body.resultData.id;
    });

    it('should get a fare estimate by id', async () => {
      const response = await request(app.getHttpServer())
        .get(`/api/fare-estimate/${createdFareEstimateId}`)
        .expect(200);

      expect(response.body.succeeded).toBe(true);
      expect(response.body.resultData.id).toBe(createdFareEstimateId);
    });

    it('should get fare estimates by rider id', async () => {
      const response = await request(app.getHttpServer())
        .get(`/api/fare-estimate/rider/${createdRiderId}`)
        .expect(200);

      expect(response.body.succeeded).toBe(true);
      expect(Array.isArray(response.body.resultData)).toBe(true);
      expect(response.body.resultData.length).toBeGreaterThan(0);
    });

    it('should get all fare estimates', async () => {
      const response = await request(app.getHttpServer())
        .get('/api/fare-estimate')
        .expect(200);

      expect(response.body.succeeded).toBe(true);
      expect(Array.isArray(response.body.resultData)).toBe(true);
    });

    it('should update a fare estimate', async () => {
      const updateData = {
        estimatedPrice: 120,
      };

      const response = await request(app.getHttpServer())
        .put(`/api/fare-estimate/${createdFareEstimateId}`)
        .send(updateData)
        .expect(200);

      expect(response.body.succeeded).toBe(true);
      expect(response.body.resultData.estimatedPrice).toBe(120);
    });

    it('should delete a fare estimate', async () => {
      const response = await request(app.getHttpServer())
        .delete(`/api/fare-estimate/${createdFareEstimateId}`)
        .expect(200);

      expect(response.body.succeeded).toBe(true);
    });

    it('should return 404 when trying to get a deleted fare estimate', async () => {
      await request(app.getHttpServer())
        .get(`/api/fare-estimate/${createdFareEstimateId}`)
        .expect(404);
    });
  });
});
