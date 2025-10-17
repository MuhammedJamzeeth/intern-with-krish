import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { HotelSeeder } from './seeds/hotel.seeder';
import { Logger } from '@nestjs/common';

async function bootstrap() {
  const logger = new Logger('Bootstrap');

  logger.debug('Starting application...');
  const app = await NestFactory.create(AppModule);
  await app.listen(process.env.PORT ?? 3002);

  try {
    const seeder = app.get(HotelSeeder);
    await seeder.seed();
    logger.debug('Seeding completed');
    logger.debug(
      `Application is running on: http://localhost:${process.env.PORT ?? 3002}`,
    );
  } catch (error) {
    logger.error(`Failed to seed hotel data: ${error.message}`);
  }
}
bootstrap();
