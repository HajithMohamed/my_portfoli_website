import { NestFactory } from '@nestjs/core';
import { ValidationPipe } from '@nestjs/common';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import cookieParser from 'cookie-parser';
import helmet from 'helmet';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.use(helmet());
  app.use(cookieParser());
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
      transform: true,
    }),
  );

  const allowedOrigins = [
    process.env.FRONTEND_URL,
    process.env.NETLIFY_URL,
    'http://localhost:3000',
    'http://localhost:3001',
  ].filter(Boolean) as string[];

  app.enableCors({
    origin: allowedOrigins,
    credentials: true,
  });

  const config = new DocumentBuilder()
    .setTitle('Hz Labs Portfolio API')
    .setDescription(
      'CMS, portfolio, GitHub intelligence, resume, and message APIs for Hz Labs.',
    )
    .setVersion('0.1.0')
    .addBearerAuth()
    .build();
  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('docs', app, document);

  const port = process.env.PORT ?? 4000;

  try {
    await app.listen(port);
    console.log(`🚀 Hz Labs API running on http://localhost:${port}`);
    console.log(`📄 Swagger docs at http://localhost:${port}/docs`);
  } catch (error: unknown) {
    if (
      error instanceof Error &&
      'code' in error &&
      (error as NodeJS.ErrnoException).code === 'EADDRINUSE'
    ) {
      console.error(
        `\n❌ Port ${port} is already in use.\n` +
          `   → Another instance may already be running.\n` +
          `   → Fix: kill the process on port ${port}, or set a different PORT in .env\n`,
      );
      process.exit(1);
    }
    throw error;
  }
}
void bootstrap();
