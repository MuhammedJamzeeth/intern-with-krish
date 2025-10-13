import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { EventSeeder } from './seeds/event.seeder';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  await app.listen(process.env.PORT ?? 3004);

  const seed = app.get(EventSeeder);
  await seed.seed();
  
}
bootstrap();
