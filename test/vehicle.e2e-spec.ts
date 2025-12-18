import { Test, TestingModule } from '@nestjs/testing';
import { ValidationPipe } from '@nestjs/common';
import request from 'supertest';
import { TestAppModule } from './test-app.module';
import { FastifyAdapter, NestFastifyApplication } from '@nestjs/platform-fastify';
import { VehicleCategory } from 'src/domain/enums/vehicle-category.enum';
import { VehicleStatus } from 'src/domain/enums/vehicle-status.enum';

describe('VehicleController (e2e)', () => {
  let app: NestFastifyApplication;
  let createdVehicleId: string;
  let createdOwnerId: string;

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [TestAppModule],
    }).compile();

    app = moduleFixture.createNestApplication<NestFastifyApplication>(new FastifyAdapter());
    app.setGlobalPrefix('api');
    app.useGlobalPipes(new ValidationPipe());
    await app.init();

    // Create a user to be the owner of the vehicle
    const userEmail = `vehicle_owner_${Date.now()}@example.com`;
    const userResponse = await request(app.getHttpServer())
      .post('/api/user')
      .send({
        email: userEmail,
        phone: `081${Math.floor(Math.random() * 1000000000)}`,
        password: 'Password123!',
        firstName: 'Vehicle',
        lastName: 'Owner',
        userType: 'DRIVER',
      });

    expect(userResponse.statusCode).toBe(201);
    createdOwnerId = userResponse.body.resultData.id;
  });

  afterAll(async () => {
    await app.close();
  });

  describe('/api/vehicle', () => {
    it('should create a new vehicle', async () => {
      const vehicleData = {
        ownerId: createdOwnerId,
        plateNumber: `TEST-${Date.now()}`,
        model: 'Test Model S',
        make: 'Testla',
        year: 2023,
        color: 'Black',
        category: VehicleCategory.PREMIUM,
        status: VehicleStatus.ACTIVE,
        isCompanyVehicle: false,
      };

      const response = await request(app.getHttpServer())
        .post('/api/vehicle')
        .send(vehicleData)
        .expect(201);

      expect(response.body.succeeded).toBe(true);
      expect(response.body.resultData).toHaveProperty('id');
      createdVehicleId = response.body.resultData.id;
      expect(response.body.resultData.ownerId).toBe(createdOwnerId);
    });

    it('should get a vehicle by id', async () => {
      const response = await request(app.getHttpServer())
        .get(`/api/vehicle/${createdVehicleId}`)
        .expect(200);

      expect(response.body.succeeded).toBe(true);
      expect(response.body.resultData.id).toBe(createdVehicleId);
    });

    it('should get all vehicles', async () => {
      const response = await request(app.getHttpServer())
        .get('/api/vehicle')
        .expect(200);

      expect(response.body.succeeded).toBe(true);
      expect(Array.isArray(response.body.resultData)).toBe(true);
    });

    it('should update a vehicle', async () => {
      const updateData = {
        status: VehicleStatus.INACTIVE,
        color: 'White',
      };

      const response = await request(app.getHttpServer())
        .put(`/api/vehicle/${createdVehicleId}`)
        .send(updateData)
        .expect(200);

      expect(response.body.succeeded).toBe(true);
      expect(response.body.resultData.status).toBe(VehicleStatus.INACTIVE);
      expect(response.body.resultData.color).toBe('White');
    });

    it('should delete a vehicle', async () => {
      await request(app.getHttpServer())
        .delete(`/api/vehicle/${createdVehicleId}`)
        .expect(200);
    });

    it('should return 404 for the deleted vehicle', async () => {
      await request(app.getHttpServer())
        .get(`/api/vehicle/${createdVehicleId}`)
        .expect(404);
    });
  });
});