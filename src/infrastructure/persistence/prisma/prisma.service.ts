import { Injectable, OnModuleInit, OnModuleDestroy, Logger } from '@nestjs/common';
import { PrismaClient } from '@prisma/client';

@Injectable()
export class PrismaService extends PrismaClient implements OnModuleInit, OnModuleDestroy {
  private readonly logger = new Logger(PrismaService.name);

  constructor() {
    super({
      log: [
        { emit: 'event', level: 'query' },
        { emit: 'event', level: 'error' },
        { emit: 'event', level: 'info' },
        { emit: 'event', level: 'warn' },
      ],
    });
  }

  async onModuleInit() {
    this.$on('query', (e) => {
      if (process.env.NODE_ENV === 'development') {
        this.logger.debug(`Query: ${e.query} - Duration: ${e.duration}ms`);
      }
    });

    this.$on('error', (e) => {
      this.logger.error('Prisma Error:', e);
    });

    try {
      await this.$connect();
      this.logger.log('Connected to database');
    } catch (error) {
      this.logger.error('Failed to connect to the database:', error);
      throw error;
    }
  }

  async onModuleDestroy() {
    await this.$disconnect();
    this.logger.log('Disconnected from database');
  }

  async enableShutdownHooks(app: any) {
    this.$on('beforeExit', async () => {
      try {
        await app.close();
      } catch (error) {
        this.logger.error('Error during application shutdown:', error);
      }
    });
  }
}
