import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { FastifyAdapter, NestFastifyApplication } from '@nestjs/platform-fastify';
import { join } from 'path';
import { applyDecorators, ValidationPipe } from '@nestjs/common';
import { ApiBadRequestResponse, ApiConflictResponse, ApiNotFoundResponse, ApiUnauthorizedResponse, DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import * as fastifyStatic from '@fastify/static';
import { HttpExceptionFilter } from './shared/filters/http-exception.filter';
import { LoggingInterceptor } from './shared/interceptors/logging.interceptor';

async function bootstrap() {
  const app = await NestFactory.create<NestFastifyApplication>(AppModule, new FastifyAdapter());
  app.useGlobalFilters(new HttpExceptionFilter());
  app.useGlobalInterceptors(new LoggingInterceptor());
  app.useGlobalPipes(new ValidationPipe({ 
    whitelist: true,
    transform: true,
  }));

  app.enableCors();
  app.setGlobalPrefix('api');

  const config = new DocumentBuilder()
  .setTitle('code-ride API')
  .setDescription('')
  .setVersion('1.0')
  .addTag('main')
  .build();
  const document = SwaggerModule.createDocument(app, config, {
    autoTagControllers: true,
    include: [],
  });
  // Serve Swagger UI under /api/docs to avoid colliding with the global '/api' prefix
  SwaggerModule.setup('api/docs', app, document, {
    swaggerOptions: {
      persistAuthorization: true,
      displayRequestDuration: true,
    },
    });

  // Register static assets with Fastify directly to avoid duplicate decorator errors
  const fastify = app.getHttpAdapter().getInstance();
  await fastify.register(fastifyStatic.default, {
    root: join(__dirname, '..', 'uploads'),
    prefix: '/uploads/',
    decorateReply: true,
    index: false,
  });

  // Second registration must not redecorate reply methods (sendFile), so set decorateReply: false
  await fastify.register(fastifyStatic.default, {
    root: join(__dirname, '..'),
    prefix: '/test/',
    decorateReply: false,
    index: 'test-client.html',
  });

  await app.listen(process.env.PORT ?? 3000);
  console.log(`Application is running on: ${await app.getUrl()}`);
}
bootstrap();

export function CommonApiResponses() {
  return applyDecorators(
    ApiBadRequestResponse({ description: 'Bad Request' }),
    ApiUnauthorizedResponse({ description: 'Unauthorized' }),
    ApiNotFoundResponse({ description: 'Not Found' }),
    ApiConflictResponse({ description: 'Conflict' }),
  );
}
