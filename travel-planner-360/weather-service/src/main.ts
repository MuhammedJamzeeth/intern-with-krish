import { Logger } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { WeatherSeeder } from './seeds/weather.seeder';

async function bootstrap() {
  const logger = new Logger('Bootstrap');

  logger.debug('Starting application...');

  const app = await NestFactory.create(AppModule);
  await app.listen(process.env.PORT ?? 3003);

  try {
    const seed = app.get(WeatherSeeder);
    await seed.seed();
    
    logger.debug('Seeding completed');
    logger.debug(
      `Application is running on: http://localhost:${process.env.PORT ?? 3003}`,
    );
  } catch (error) {
    logger.error('Seeding failed', error.stack);
  }
}
bootstrap();
