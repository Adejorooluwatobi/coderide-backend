import { Test, TestingModule } from '@nestjs/testing';
import { ValidationPipe } from '@nestjs/common';
import request from 'supertest';
import { AppModule } from '../src/app.module';
import { FastifyAdapter, NestFastifyApplication } from '@nestjs/platform-fastify';
import { TicketStatus } from 'src/domain/enums/ticket-status.enum';

describe('TicketMessageController (e2e)', () => {
  let app: NestFastifyApplication;
  let userId: string;
  let ticketId: string;
  let messageId: string;

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
      email: `message_user_${Date.now()}@example.com`,
      password: 'Password123!',
      firstName: 'Ticket',
      lastName: 'User',
      phone: `081${Math.floor(Math.random() * 1000000000)}`,
      userType: 'RIDER',
    });
    userId = userRes.body.resultData.id;

    // Create a support ticket to add messages to
    const ticketRes = await request(app.getHttpServer()).post('/api/support-ticket').send({
        userId: userId,
        subject: 'Message Test',
        description: 'Testing ticket messages.',
        status: TicketStatus.OPEN,
    });
    ticketId = ticketRes.body.resultData.id;
  });

  afterAll(async () => {
    await app.close();
  });

  describe('/api/ticket-message', () => {
    it('should add a message to a ticket', async () => {
      const messageData = {
        ticketId: ticketId,
        senderId: userId,
        message: 'This is the first message.',
      };

      const response = await request(app.getHttpServer())
        .post('/api/ticket-message')
        .send(messageData)
        .expect(201);

      expect(response.body.succeeded).toBe(true);
      messageId = response.body.resultData.id;
      expect(messageId).toBeDefined();
    });

    it('should get all messages for a ticket', async () => {
      const response = await request(app.getHttpServer())
        .get(`/api/ticket-message/ticket/${ticketId}`)
        .expect(200);

      expect(Array.isArray(response.body.resultData)).toBe(true);
      expect(response.body.resultData.length).toBeGreaterThan(0);
      expect(response.body.resultData[0].message).toBe('This is the first message.');
    });
  });
});