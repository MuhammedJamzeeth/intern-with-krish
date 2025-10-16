import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { FlightSeeder } from './seeds/flight.seeds';
import { Logger } from '@nestjs/common';

async function bootstrap() {
  const logger = new Logger('Bootstrap');

  logger.debug('Application is bootstrapping...');
  const app = await NestFactory.create(AppModule);
  await app.listen(process.env.PORT ?? 3001);

  try {
    logger.debug('Starting database seeding...');
    const seeder = app.get(FlightSeeder);

    await seeder.seed();
    logger.debug(
      `Application is running on: http://localhost:${process.env.PORT ?? 3001}`,
    );
  } catch (error) {
    logger.error('Database seeding failed', error);
  }
}
bootstrap();
