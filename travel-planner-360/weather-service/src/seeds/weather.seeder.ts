import { Injectable, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { WeatherForecast } from 'src/entities/weather.entity';
import { Repository } from 'typeorm';

@Injectable()
export class WeatherSeeder {
  private readonly logger = new Logger(WeatherSeeder.name);

  constructor(
    @InjectRepository(WeatherForecast)
    private weatherRepository: Repository<WeatherForecast>,
  ) {}

  async seed() {
    this.logger.log('Starting weather data seeding...');

    const existingWeather = await this.weatherRepository.count();
    if (existingWeather > 0) {
      this.logger.log('Weather data already seeded. Skipping...');
      return;
    }

    const weatherData = [
      // Bangkok
      { destination: 'BKK', date: '2025-12-10', tempMin: 24, tempMax: 33, condition: 'Sunny' },
      { destination: 'BKK', date: '2025-12-11', tempMin: 25, tempMax: 34, condition: 'Partly Cloudy' },
      { destination: 'BKK', date: '2025-12-12', tempMin: 24, tempMax: 32, condition: 'Rainy' },
      { destination: 'BKK', date: '2025-12-13', tempMin: 23, tempMax: 31, condition: 'Thunderstorms' },
      { destination: 'BKK', date: '2025-12-14', tempMin: 24, tempMax: 33, condition: 'Sunny' },
      { destination: 'BKK', date: '2025-12-15', tempMin: 25, tempMax: 34, condition: 'Sunny' },
      { destination: 'BKK', date: '2025-12-16', tempMin: 24, tempMax: 33, condition: 'Partly Cloudy' },

      // Singapore
      { destination: 'SIN', date: '2025-12-10', tempMin: 26, tempMax: 31, condition: 'Humid' },
      { destination: 'SIN', date: '2025-12-11', tempMin: 26, tempMax: 32, condition: 'Rainy' },
      { destination: 'SIN', date: '2025-12-12', tempMin: 25, tempMax: 30, condition: 'Cloudy' },
      { destination: 'SIN', date: '2025-12-13', tempMin: 26, tempMax: 31, condition: 'Sunny' },
      { destination: 'SIN', date: '2025-12-14', tempMin: 26, tempMax: 32, condition: 'Humid' },
      { destination: 'SIN', date: '2025-12-15', tempMin: 25, tempMax: 31, condition: 'Partly Cloudy' },
      { destination: 'SIN', date: '2025-12-16', tempMin: 26, tempMax: 31, condition: 'Rainy' },

      // Phuket
      { destination: 'HKT', date: '2025-12-10', tempMin: 25, tempMax: 32, condition: 'Sunny' },
      { destination: 'HKT', date: '2025-12-11', tempMin: 26, tempMax: 33, condition: 'Clear' },
      { destination: 'HKT', date: '2025-12-12', tempMin: 25, tempMax: 31, condition: 'Partly Cloudy' },
      { destination: 'HKT', date: '2025-12-13', tempMin: 24, tempMax: 30, condition: 'Rainy' },
      { destination: 'HKT', date: '2025-12-14', tempMin: 25, tempMax: 32, condition: 'Sunny' },
      { destination: 'HKT', date: '2025-12-15', tempMin: 26, tempMax: 33, condition: 'Clear' },
      { destination: 'HKT', date: '2025-12-16', tempMin: 25, tempMax: 32, condition: 'Sunny' },

      // Goa
      { destination: 'GOA', date: '2025-12-10', tempMin: 22, tempMax: 30, condition: 'Sunny' },
      { destination: 'GOA', date: '2025-12-11', tempMin: 23, tempMax: 31, condition: 'Clear' },
      { destination: 'GOA', date: '2025-12-12', tempMin: 22, tempMax: 29, condition: 'Partly Cloudy' },
      { destination: 'GOA', date: '2025-12-13', tempMin: 21, tempMax: 28, condition: 'Cloudy' },
      { destination: 'GOA', date: '2025-12-14', tempMin: 22, tempMax: 30, condition: 'Sunny' },
      { destination: 'GOA', date: '2025-12-15', tempMin: 23, tempMax: 31, condition: 'Clear' },
      { destination: 'GOA', date: '2025-12-16', tempMin: 22, tempMax: 30, condition: 'Sunny' },
    ];

    for (const data of weatherData) {
      const weather = this.weatherRepository.create(data);
      await this.weatherRepository.save(weather);
    }

    this.logger.log(`Successfully seeded ${weatherData.length} weather forecasts`);
  }
}