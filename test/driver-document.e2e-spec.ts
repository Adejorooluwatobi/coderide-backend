import { Test, TestingModule } from '@nestjs/testing';
import { ValidationPipe } from '@nestjs/common';
import { AppModule } from '../src/app.module';
import { FastifyAdapter, NestFastifyApplication } from '@nestjs/platform-fastify';
import { CreateDriverDocumentDto } from 'src/application/DTO/driver-document/create-driver-document.dto';
import { DocumentStatus } from 'src/domain/enums/document-status.enum';
import { DocumentType } from 'src/domain/enums/document-type.enum';
import request from 'supertest';

describe('DriverDocumentController (e2e)', () => {
  jest.setTimeout(30000);

  let app: NestFastifyApplication;
  let createdDriverId: string;
  let createdDocumentId: string;

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
    const userEmail = `driver_doc_user_${Date.now()}@example.com`;
    const userResponse = await request(app.getHttpServer())
      .post('/api/user')
      .send({
        email: userEmail,
        phone: `081${Math.floor(Math.random() * 1000000000)}`,
        password: 'Password123!',
        firstName: 'Doc',
        lastName: 'Driver',
        userType: 'DRIVER',
      });
    expect(userResponse.statusCode).toBe(201);
    const userId = userResponse.body.resultData.id;

    const driverResponse = await request(app.getHttpServer())
      .post('/api/driver/company')
      .send({
        userId: userId,
        licenseNumber: `DOC-LIC-${Date.now()}`,
        licenseExpiry: new Date(),
      });
    expect(driverResponse.statusCode).toBe(201);
    createdDriverId = driverResponse.body.resultData.id;
  });

  afterAll(async () => {
    await app.close();
  });

  describe('/api/driver-document', () => {
    it('should create a new driver document', async () => {
      const documentData: CreateDriverDocumentDto = {
        driverId: createdDriverId,
        documentType: DocumentType.DRIVERS_LICENSE,
        documentUrl: 'http://example.com/license.jpg',
        status: DocumentStatus.PENDING,
        uploadedAt: new Date(),
      };

      const response = await request(app.getHttpServer())
        .post('/api/driver-document')
        .send(documentData)
        .expect(201);

      expect(response.body.succeeded).toBe(true);
      expect(response.body.resultData).toHaveProperty('id');
      expect(response.body.resultData.driverId).toBe(createdDriverId);
      createdDocumentId = response.body.resultData.id;
    });

    it('should get a driver document by id', async () => {
      const response = await request(app.getHttpServer())
        .get(`/api/driver-document/${createdDocumentId}`)
        .expect(200);

      expect(response.body.succeeded).toBe(true);
      expect(response.body.resultData.id).toBe(createdDocumentId);
    });

    it('should get driver documents by driver id', async () => {
      const response = await request(app.getHttpServer())
        .get(`/api/driver-document/driver/${createdDriverId}`)
        .expect(200);

      expect(response.body.succeeded).toBe(true);
      expect(Array.isArray(response.body.resultData)).toBe(true);
      expect(response.body.resultData.length).toBeGreaterThan(0);
    });

    it('should get all driver documents', async () => {
      const response = await request(app.getHttpServer())
        .get('/api/driver-document')
        .expect(200);

      expect(response.body.succeeded).toBe(true);
      expect(Array.isArray(response.body.resultData)).toBe(true);
    });

    it('should get driver documents by status', async () => {
      const response = await request(app.getHttpServer())
        .get(`/api/driver-document/status/${DocumentStatus.PENDING}`)
        .expect(200);

      expect(response.body.succeeded).toBe(true);
      expect(Array.isArray(response.body.resultData)).toBe(true);
    });

    it('should update a driver document', async () => {
      const updateData = {
        status: DocumentStatus.APPROVED,
      };

      const response = await request(app.getHttpServer())
        .put(`/api/driver-document/${createdDocumentId}`)
        .send(updateData)
        .expect(200);

      expect(response.body.succeeded).toBe(true);
      expect(response.body.resultData.status).toBe(DocumentStatus.APPROVED);
    });

    it('should delete a driver document', async () => {
      const response = await request(app.getHttpServer())
        .delete(`/api/driver-document/${createdDocumentId}`)
        .expect(200);

      expect(response.body.succeeded).toBe(true);
    });

    it('should return 404 when trying to get a deleted driver document', async () => {
      await request(app.getHttpServer())
        .get(`/api/driver-document/${createdDocumentId}`)
        .expect(404);
    });
  });
});
