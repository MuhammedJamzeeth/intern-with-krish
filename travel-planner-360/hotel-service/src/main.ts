import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { HotelSeeder } from './seeds/hotel.seeder';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  await app.listen(process.env.PORT ?? 3002);

  const seeder = app.get(HotelSeeder);
  await seeder.seed();
  
}
bootstrap();
