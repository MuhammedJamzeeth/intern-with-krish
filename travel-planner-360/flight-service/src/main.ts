import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { FlightSeeder } from './seeds/flight.seeds';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  await app.listen(process.env.PORT ?? 3001);

  const seeder = app.get(FlightSeeder);
  await seeder.seed();
}
bootstrap();
