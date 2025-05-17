import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import helmet from 'helmet';
import { ValidationPipe } from '@nestjs/common';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { WinstonModule } from 'nest-winston';
import * as winston from "winston"
import { NestExpressApplication } from '@nestjs/platform-express';
import { join } from 'path';

async function bootstrap() {
  const logger = WinstonModule.createLogger({
    transports: [
      new winston.transports.Console({
        format: winston.format.combine(winston.format.timestamp(), winston.format.json()),
      }),
      new winston.transports.File({
        filename: "logs/error.log",
        level: "error",
        format: winston.format.combine(winston.format.timestamp(), winston.format.json()),
      }),
      new winston.transports.File({
        filename: "logs/combined.log",
        format: winston.format.combine(winston.format.timestamp(), winston.format.json()),
      }),
    ],
  })

  const app = await NestFactory.create<NestExpressApplication>(AppModule, { logger });
  app.useStaticAssets(join(__dirname, '..', 'public'), {
  index: false,
  prefix: '/',
});

  app.enableCors()
  app.use(helmet())

  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
      transform: true,
    }),
  );
  
  const globalPrefix = 'api/v1';
  app.setGlobalPrefix(globalPrefix);

  const config = new DocumentBuilder()
    .setTitle("Employee Hierarchy API")
    .setDescription("API for employee hierarchy information")
    .setVersion("1.0")
    .addBearerAuth()
    .build()
  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup(`${globalPrefix}/docs`, app, document);
  
  await app.listen(process.env.PORT ?? 3000);
}
bootstrap();
