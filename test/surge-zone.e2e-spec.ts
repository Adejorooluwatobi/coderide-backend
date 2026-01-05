import { Test, TestingModule } from '@nestjs/testing';
import { ValidationPipe } from '@nestjs/common';
import request from 'supertest';
import { AppModule } from '../src/app.module';
import { FastifyAdapter, NestFastifyApplication } from '@nestjs/platform-fastify';

describe('SurgeZoneController (e2e)', () => {
  let app: NestFastifyApplication;
  let surgeZoneId: string;

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
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

  describe('/api/surge-zone', () => {
    it('should create a new surge zone', async () => {
      const surgeZoneData = {
        name: 'Downtown Surge',
        latitude: 6.4541,
        longitude: 3.3947,
        radius: 5000, // 5km
        multiplier: 1.5,
        isActive: true,
      };

      const response = await request(app.getHttpServer())
        .post('/api/surge-zone')
        .send(surgeZoneData)
        .expect(201);

      expect(response.body.succeeded).toBe(true);
      surgeZoneId = response.body.resultData.id;
      expect(surgeZoneId).toBeDefined();
    });

    it('should get all surge zones', async () => {
      const response = await request(app.getHttpServer())
        .get('/api/surge-zone')
        .expect(200);

      expect(Array.isArray(response.body.resultData)).toBe(true);
      expect(response.body.resultData.length).toBeGreaterThan(0);
    });

    it('should update a surge zone', async () => {
      const response = await request(app.getHttpServer())
        .put(`/api/surge-zone/${surgeZoneId}`)
        .send({ multiplier: 1.8, isActive: false })
        .expect(200);

      expect(response.body.resultData.multiplier).toBe(1.8);
      expect(response.body.resultData.isActive).toBe(false);
    });

    it('should delete a surge zone', async () => {
      await request(app.getHttpServer())
        .delete(`/api/surge-zone/${surgeZoneId}`)
        .expect(200);
    });
  });
});