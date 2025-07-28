import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  // Enable CORS only for local development
  if (process.env.NODE_ENV !== 'production') {
    app.enableCors({
      origin: 'http://localhost:4200',
      credentials: true,
    });
  } else if (process.env.NODE_ENV === 'production') {
    const allowedOrigins = ['https://www.pokebot.at', 'https://pokebot.at'];
    app.enableCors({
      origin: allowedOrigins,
      credentials: true,
    });
  }

  await app.listen(process.env.PORT ?? 3000);
}
bootstrap();
