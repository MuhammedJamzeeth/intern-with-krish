import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { EventSeeder } from './seeds/event.seeder';
import { Logger, ValidationPipe } from '@nestjs/common';

async function bootstrap() {
  const logger = new Logger('Bootstrap');

  logger.debug('Starting application bootstrap');

  const app = await NestFactory.create(AppModule);

  const port = process.env.PORT ?? 3004;
  await app.listen(port);
  logger.debug(`Application is listening on port ${port}`);

  try {
    const seed = app.get(EventSeeder);
    await seed.seed();

    logger.debug('Seeding completed successfully');
    logger.debug(
      `Application is running on: http://localhost:${process.env.PORT ?? 3004}`,
    );
  } catch (err) {
    logger.error(
      'Seeding failed (seeder may not be provided)',
      err?.stack ?? err,
    );
  }
}

bootstrap();
