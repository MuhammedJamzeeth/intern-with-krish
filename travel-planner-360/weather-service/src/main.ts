import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { WeatherSeeder } from './seeds/weather.seeder';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  await app.listen(process.env.PORT ?? 3003);

  const seed = app.get(WeatherSeeder);
  await seed.seed();
}
bootstrap();
