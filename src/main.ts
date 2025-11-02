import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import { ConfigService } from '@nestjs/config';
import { ValidationPipe } from '@nestjs/common';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  const configService = app.get(ConfigService);

  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true, // Eliminar propiedades no definidas en el DTO
      forbidNonWhitelisted: true,
      transform: true,
      transformOptions: {
        enableImplicitConversion: true,
      },
    }
    ));

  // Configurar CORS
  app.enableCors({
    origin: configService.get<string>('CORS_ORIGIN', '*'),
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH'],
    credentials: true,
    allowedHeaders: ['Content-Type', 'Authorization', 'Accept'],
  });

  // Prefijo global para todas las rutas
  app.setGlobalPrefix('api');

  const config = new DocumentBuilder()
    .setTitle('Red Social')
    .setDescription('The Red Social API description')
    .setVersion('1.0')
    .addTag('red-social')
    .build();
  const documentFactory = () => SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api', app, documentFactory);

  const port = configService.get<number>('PORT', 3000);
  await app.listen(port);

  console.log(`🚀 Aplicación corriendo en: http://localhost:${port}/api`);
  console.log(`📊 Ambiente: ${configService.get<string>('NODE_ENV')}`);

}
bootstrap();
