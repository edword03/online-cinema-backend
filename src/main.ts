import { ValidationPipe } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ConfigService } from '@nestjs/config';
import { config } from 'aws-sdk';

const PORT = process.env.PORT || 4000;

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const configService = app.get(ConfigService);

  const MODE = configService.get('MODE');

  app.setGlobalPrefix('api');
  app.useGlobalPipes(new ValidationPipe());

  if (MODE === 'production') {
    app.enableCors({
      origin: configService.get('HOST_URL'),
      credentials: true,
    });
  } else {
    app.enableCors({
      origin: 'http://localhost:3000',
      credentials: true,
    });
  }

  config.update({
    accessKeyId: configService.get('AWS_ACCESS_KEY_ID'),
    secretAccessKey: configService.get('AWS_SECRET_ACCESS_KEY'),
    region: configService.get('AWS_REGION'),
    s3ForcePathStyle: true,
    apiVersion: 'latest',
  });

  await app.listen(PORT);
}

bootstrap();
