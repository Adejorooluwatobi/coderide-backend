import { Injectable, Logger, OnModuleDestroy } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { createClient, RedisClientType } from 'redis';

@Injectable()
export class RedisService implements OnModuleDestroy {
  private readonly logger = new Logger(RedisService.name);
  private client: RedisClientType;

  constructor(private configService: ConfigService) {
    const redisHost = this.configService.get('REDIS_HOST');
    
    // Only create Redis client if explicitly configured
    if (redisHost && redisHost !== 'localhost') {
      this.client = createClient({
        socket: {
          host: redisHost,
          port: parseInt(this.configService.get('REDIS_PORT', '6379'), 10),
        },
        password: this.configService.get('REDIS_PASSWORD'),
      });

      this.client.on('error', (err) => {
        this.logger.error('Redis Client Error', err);
      });

      this.client.connect().catch((err) => {
        this.logger.error('Failed to connect to Redis', err);
      });
    } else {
      this.logger.log('Redis not configured. Running without cache.');
    }
  }

  async get(key: string): Promise<string | null> {
    if (!this.client) return null;
    try {
      return await this.client.get(key);
    } catch (error) {
      return null;
    }
  }

  async set(key: string, value: string, ttl?: number): Promise<void> {
    if (!this.client) return;
    try {
      if (ttl) {
        await this.client.setEx(key, ttl, value);
      } else {
        await this.client.set(key, value);
      }
    } catch (error) {
      // Silently fail in development
    }
  }

  async del(key: string): Promise<void> {
    if (!this.client) return;
    try {
      await this.client.del(key);
    } catch (error) {
      // Silently fail in development
    }
  }

  async exists(key: string): Promise<boolean> {
    if (!this.client) return false;
    try {
      return (await this.client.exists(key)) === 1;
    } catch (error) {
      return false;
    }
  }

  onModuleDestroy() {
    if (this.client) {
      this.client.quit();
    }
  }
}