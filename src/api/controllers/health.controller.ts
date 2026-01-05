import { Controller, Get } from '@nestjs/common';
import { ApiTags, ApiOperation } from '@nestjs/swagger';
import { PrismaService } from 'src/infrastructure/persistence/prisma/prisma.service';
import { RedisService } from 'src/shared/services/redis.service';

@ApiTags('Health')
@Controller('health')
export class HealthController {
  constructor(
    private prismaService: PrismaService,
    private redisService: RedisService,
  ) {}

  @Get()
  @ApiOperation({ summary: 'Health check' })
  async getHealth() {
    const checks = {
      database: await this.checkDatabase(),
      redis: await this.checkRedis(),
      timestamp: new Date().toISOString(),
      uptime: process.uptime(),
      memory: process.memoryUsage(),
    };

    const isHealthy = 
      checks.database.status === 'ok' && 
      checks.redis.status === 'ok';

    return {
      status: isHealthy ? 'ok' : 'error',
      checks,
    };
  }

  private async checkDatabase() {
    try {
      await this.prismaService.$queryRaw`SELECT 1`;
      return { status: 'ok', message: 'Database connection successful' };
    } catch (error) {
      return { status: 'error', message: error.message };
    }
  }

  private async checkRedis() {
    try {
      await this.redisService.set('health-check', 'ok', 10);
      const result = await this.redisService.get('health-check');
      return { 
        status: result === 'ok' ? 'ok' : 'error', 
        message: 'Redis connection successful' 
      };
    } catch (error) {
      return { status: 'error', message: error.message };
    }
  }
}