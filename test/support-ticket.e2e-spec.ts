import { Test, TestingModule } from '@nestjs/testing';
import { ValidationPipe } from '@nestjs/common';
import request from 'supertest';
import { AppModule } from '../src/app.module';
import { FastifyAdapter, NestFastifyApplication } from '@nestjs/platform-fastify';
import { TicketStatus } from 'src/domain/enums/ticket-status.enum';

describe('SupportTicket & TicketMessage Controllers (e2e)', () => {
  let app: NestFastifyApplication;
  let userId: string;
  let ticketId: string;

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication<NestFastifyApplication>(new FastifyAdapter());
    app.setGlobalPrefix('api');
    app.useGlobalPipes(new ValidationPipe());
    await app.init();
    await app.getHttpAdapter().getInstance().ready();

    // Create a user for the tests
    const userRes = await request(app.getHttpServer()).post('/api/user').send({
      email: `support_user_${Date.now()}@example.com`,
      phone: `081${Math.floor(Math.random() * 1000000000)}`,
      password: 'Password123!',
      firstName: 'Support',
      lastName: 'User',
      userType: 'RIDER',
    });
    expect(userRes.statusCode).toBe(201);
    userId = userRes.body.resultData.id;
  });

  afterAll(async () => {
    await app.close();
  });

  describe('/api/support-ticket', () => {
    it('should create a new support ticket', async () => {
      const ticketData = {
        userId: userId,
        subject: 'Lost Item',
        description: 'I left my wallet in the car.',
        status: TicketStatus.OPEN,
      };

      const response = await request(app.getHttpServer())
        .post('/api/support-ticket')
        .send(ticketData)
        .expect(201);

      expect(response.body.succeeded).toBe(true);
      expect(response.body.resultData).toHaveProperty('id');
      ticketId = response.body.resultData.id;
      expect(response.body.resultData.subject).toBe('Lost Item');
    });

    it('should get a ticket by id', async () => {
      const response = await request(app.getHttpServer())
        .get(`/api/support-ticket/${ticketId}`)
        .expect(200);
      expect(response.body.resultData.id).toBe(ticketId);
    });

    it('should get tickets by user id', async () => {
      const response = await request(app.getHttpServer())
        .get(`/api/support-ticket/user/${userId}`)
        .expect(200);
      expect(Array.isArray(response.body.resultData)).toBe(true);
      expect(response.body.resultData.length).toBeGreaterThan(0);
    });

    it('should update a ticket status', async () => {
      const response = await request(app.getHttpServer())
        .put(`/api/support-ticket/${ticketId}`)
        .send({ status: TicketStatus.RESOLVED })
        .expect(200);
      expect(response.body.resultData.status).toBe(TicketStatus.RESOLVED);
    });
  });

  describe('/api/ticket-message', () => {
    it('should add a message to a ticket', async () => {
      const messageData = {
        ticketId: ticketId,
        senderId: userId,
        message: 'Any updates on my wallet?',
      };

      const response = await request(app.getHttpServer())
        .post('/api/ticket-message')
        .send(messageData)
        .expect(201);

      expect(response.body.succeeded).toBe(true);
      expect(response.body.resultData).toHaveProperty('id');
      expect(response.body.resultData.message).toBe('Any updates on my wallet?');
    });

    it('should get all messages for a ticket', async () => {
      const response = await request(app.getHttpServer())
        .get(`/api/ticket-message/ticket/${ticketId}`)
        .expect(200);

      expect(Array.isArray(response.body.resultData)).toBe(true);
      expect(response.body.resultData.length).toBeGreaterThan(0);
    });
  });
});