import { Test, TestingModule } from '@nestjs/testing';
import { ValidationPipe } from '@nestjs/common';
import { FastifyAdapter, NestFastifyApplication } from '@nestjs/platform-fastify';
import request from 'supertest';
import { TestAppModule } from './test-app.module';
import { AdminPermission } from 'src/domain/enums/admin-permision.enum';

describe('AdminController (e2e)', () => {
  let app: NestFastifyApplication;
  let createdAdminId: string;
  let adminUsername: string;

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [TestAppModule],
    }).compile();

    app = moduleFixture.createNestApplication<NestFastifyApplication>(new FastifyAdapter());
    app.setGlobalPrefix('api');
    app.useGlobalPipes(new ValidationPipe());
    await app.init();
    await app.getHttpAdapter().getInstance().ready();
  });

  afterAll(async () => {
    await app.close();
  });

  describe('/api/admin', () => {
    it('should create a new admin', async () => {
      adminUsername = `admin_${Date.now()}`;
      const adminData = {
        username: adminUsername,
        password: 'SuperSecretPassword123!',
        // email: Removed because Admin entity does not have email
        permissions: AdminPermission.MANAGE_SYSTEM_SETTINGS,
      };

      const _response = await request(app.getHttpServer())
        .post('/api/admin')
        .send(adminData)
        .expect(201);

      expect(_response.body.succeeded).toBe(true);
      expect(_response.body.resultData).toHaveProperty('id');
      createdAdminId = _response.body.resultData.id;
    });

    it('should get an admin by id', async () => {
      const response = await request(app.getHttpServer())
        .get(`/api/admin/${createdAdminId}`)
        .expect(200);

      expect(response.body.succeeded).toBe(true);
      expect(response.body.resultData.id).toBe(createdAdminId);
    });

    it('should get all admins', async () => {
      const response = await request(app.getHttpServer())
        .get('/api/admin')
        .expect(200);

      expect(response.body.succeeded).toBe(true);
      expect(Array.isArray(response.body.resultData)).toBe(true);
    });

    it('should update an admin', async () => {
      const updateData = {
        username: `${adminUsername}_updated`,
      };

      const _response = await request(app.getHttpServer())
        .put(`/api/admin/${createdAdminId}`)
        .send(updateData)
        .expect(200);
    });

    it('should delete an admin', async () => {
      await request(app.getHttpServer())
        .delete(`/api/admin/${createdAdminId}`)
        .expect(200);
    });

    it('should return 404 for the deleted admin', async () => {
      await request(app.getHttpServer())
        .get(`/api/admin/${createdAdminId}`)
        .expect(404);
    });
  });
});