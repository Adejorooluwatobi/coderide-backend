import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { FastifyAdapter, NestFastifyApplication } from '@nestjs/platform-fastify';
import { join } from 'path';
import { ValidationPipe, Logger } from '@nestjs/common';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import * as fastifyStatic from '@fastify/static';
import helmet from '@fastify/helmet';
import { HttpExceptionFilter } from './shared/filters/http-exception.filter';
import { LoggingInterceptor } from './shared/interceptors/logging.interceptor';
import { ResponseTransformInterceptor } from './shared/interceptors/response-transform.interceptor';

async function bootstrap() {
  const logger = new Logger('Bootstrap');
  const app = await NestFactory.create<NestFastifyApplication>(
    AppModule, 
    new FastifyAdapter({ logger: true })
  );

  // Security middleware
  await app.register(helmet, {
    contentSecurityPolicy: {
      directives: {
        defaultSrc: [`'self'`],
        styleSrc: [`'self'`, `'unsafe-inline'`],
        imgSrc: [`'self'`, 'data:', 'validator.swagger.io'],
        scriptSrc: [`'self'`, `'unsafe-inline'`],
      },
    },
  });

  // Global filters and interceptors
  app.useGlobalFilters(new HttpExceptionFilter());
  app.useGlobalInterceptors(
    new LoggingInterceptor(),
    new ResponseTransformInterceptor()
  );
  
  // Validation pipe with security settings
  app.useGlobalPipes(new ValidationPipe({ 
    whitelist: true,
    forbidNonWhitelisted: true,
    transform: true,
    disableErrorMessages: process.env.NODE_ENV === 'production',
    validateCustomDecorators: true,
  }));

  // CORS configuration
  app.enableCors({
    origin: process.env.NODE_ENV === 'production' 
      ? process.env.ALLOWED_ORIGINS?.split(',') || false
      : true,
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH'],
    allowedHeaders: ['Content-Type', 'Authorization', 'x-request-id'],
  });
  
  app.setGlobalPrefix('api/v1');

  // Swagger documentation
  if (process.env.NODE_ENV !== 'production') {
    const config = new DocumentBuilder()
      .setTitle('CodeRide API')
      .setDescription('Comprehensive ride-hailing platform API')
      .setVersion('1.0')
      .addBearerAuth()
      .addTag('Authentication')
      .addTag('Users')
      .addTag('Rides')
      .addTag('Payments')
      .addTag('Admin')
      .build();
      
    const document = SwaggerModule.createDocument(app, config);
    SwaggerModule.setup('api/docs', app, document, {
      swaggerOptions: {
        persistAuthorization: true,
        displayRequestDuration: true,
      },
    });
  }

  // Static file serving
  const fastify = app.getHttpAdapter().getInstance();
  await fastify.register(fastifyStatic.default, {
    root: join(__dirname, '..', 'uploads'),
    prefix: '/uploads/',
    decorateReply: true,
    index: false,
  });

  // Graceful shutdown
  app.enableShutdownHooks();

  const port = process.env.PORT || 3000;
  await app.listen(port, '0.0.0.0');
  
  logger.log(`🚀 Application is running on: ${await app.getUrl()}`);
  logger.log(`📚 API Documentation: ${await app.getUrl()}/api/docs`);
  logger.log(`🏥 Health Check: ${await app.getUrl()}/api/v1/health`);
}

bootstrap().catch((error) => {
  console.error('Application failed to start:', error);
  process.exit(1);
});

