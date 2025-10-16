import { Module } from '@nestjs/common';

import { WeatherForecast } from './entities/weather.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
import { WeatherSeeder } from './seeds/weather.seeder';
import { WeatherModule } from './weather/weather.module';

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
    WeatherModule,
  ],
  providers: [WeatherSeeder],
})
export class AppModule {}
