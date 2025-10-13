import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { WeatherForecast } from './entities/weather.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
import { WeatherSeeder } from './seeds/weather.seeder';

@Module({
   imports: [
    TypeOrmModule.forRoot({
      type: 'sqlite',
      database: 'weather.db',
      entities: [WeatherForecast],
      synchronize: true,
      logging: false,
    }),
    TypeOrmModule.forFeature([WeatherForecast]),
  ],
  controllers: [AppController],
  providers: [AppService, WeatherSeeder],
})
export class AppModule {}
