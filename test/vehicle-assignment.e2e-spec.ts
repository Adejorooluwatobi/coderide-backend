import { Test, TestingModule } from '@nestjs/testing';
import { ValidationPipe } from '@nestjs/common';
import request from 'supertest';
import { AppModule } from '../src/app.module';
import { FastifyAdapter, NestFastifyApplication } from '@nestjs/platform-fastify';

describe('VehicleAssignmentController (e2e)', () => {
  let app: NestFastifyApplication;
  let driverId: string;
  let vehicleId: string;
  let anotherDriverId: string;
  let assignmentId: string;

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication<NestFastifyApplication>(new FastifyAdapter());
    app.setGlobalPrefix('api');
    app.useGlobalPipes(new ValidationPipe());
    await app.init();

    // Create a driver
    const driverUserRes = await request(app.getHttpServer()).post('/api/user').send({
      email: `assign_driver_${Date.now()}@example.com`,
      password: 'Password123!',
    });
    const driverUserId = driverUserRes.body.resultData.id;
    const driverRes = await request(app.getHttpServer()).post('/api/driver/company').send({
      userId: driverUserId,
      licenseNumber: `ASSIGN-LIC-${Date.now()}`,
    });
    driverId = driverRes.body.resultData.id;

    // Create another driver for failure case test
    const anotherDriverUserRes = await request(app.getHttpServer()).post('/api/user').send({
      email: `assign_driver2_${Date.now()}@example.com`,
      password: 'Password123!',
    });
    const anotherDriverUserId = anotherDriverUserRes.body.resultData.id;
    const anotherDriverRes = await request(app.getHttpServer()).post('/api/driver/company').send({
      userId: anotherDriverUserId,
      licenseNumber: `ASSIGN-LIC2-${Date.now()}`,
    });
    anotherDriverId = anotherDriverRes.body.resultData.id;

    // Create a vehicle
    const vehicleOwnerRes = await request(app.getHttpServer()).post('/api/user').send({
      email: `assign_owner_${Date.now()}@example.com`,
      password: 'Password123!',
    });
    const ownerId = vehicleOwnerRes.body.resultData.id;
    const vehicleRes = await request(app.getHttpServer()).post('/api/vehicle').send({
      ownerId,
      plateNumber: `ASSIGN-${Date.now()}`,
      model: 'Test',
    });
    vehicleId = vehicleRes.body.resultData.id;
  });

  afterAll(async () => {
    await app.close();
  });

  describe('/api/vehicle-assignment', () => {
    it('should create a new vehicle assignment', async () => {
      const assignmentData = {
        driverId: driverId,
        vehicleId: vehicleId,
        assignmentDate: new Date(),
      };

      const response = await request(app.getHttpServer())
        .post('/api/vehicle-assignment')
        .send(assignmentData)
        .expect(201);

      expect(response.body.succeeded).toBe(true);
      assignmentId = response.body.resultData.id;
      expect(assignmentId).toBeDefined();
    });

    it('should fail to assign an already assigned vehicle', async () => {
      const assignmentData = {
        driverId: anotherDriverId,
        vehicleId: vehicleId,
        assignmentDate: new Date(),
      };

      // This should fail because the vehicle is already assigned (assuming your business logic prevents this)
      await request(app.getHttpServer())
        .post('/api/vehicle-assignment')
        .send(assignmentData)
        .expect(409); // Conflict, or another appropriate error code
    });

    it('should get assignments for a driver', async () => {
      const response = await request(app.getHttpServer())
        .get(`/api/vehicle-assignment/driver/${driverId}`)
        .expect(200);

      expect(Array.isArray(response.body.resultData)).toBe(true);
      expect(response.body.resultData.length).toBeGreaterThan(0);
    });

    it('should get assignments for a vehicle', async () => {
      const response = await request(app.getHttpServer())
        .get(`/api/vehicle-assignment/vehicle/${vehicleId}`)
        .expect(200);

      expect(Array.isArray(response.body.resultData)).toBe(true);
      expect(response.body.resultData.length).toBeGreaterThan(0);
    });

    it('should end a vehicle assignment', async () => {
      const response = await request(app.getHttpServer())
        .put(`/api/vehicle-assignment/${assignmentId}/end`)
        .send({ returnDate: new Date() })
        .expect(200);

      expect(response.body.succeeded).toBe(true);
      expect(response.body.resultData.returnDate).toBeDefined();

      // Verify the vehicle is now available by checking its status
      const vehicleResponse = await request(app.getHttpServer())
        .get(`/api/vehicle/${vehicleId}`)
        .expect(200);

      // Assuming your logic updates the vehicle status upon un-assignment
      // The status might be 'AVAILABLE' or similar. Adjust if needed.
      expect(vehicleResponse.body.resultData.status).not.toBe('IN_USE');
    });
  });
});