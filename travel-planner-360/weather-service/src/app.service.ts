import { InjectRepository } from '@nestjs/typeorm';
import {
  HttpException,
  HttpStatus,
  Injectable,
} from '@nestjs/common';
import { Repository } from 'typeorm';
import { WeatherForecast } from './entities/weather.entity';

@Injectable()
export class AppService {

   constructor(
    @InjectRepository(WeatherForecast)
    private weatherRepository: Repository<WeatherForecast>,
  ) {}

  async getForecast(city: string) {
    const delayMs = parseInt(process.env.WEATHER_DELAY_MS || '2000', 10);
    const failRate = parseFloat(process.env.WEATHER_FAIL_RATE || '0');

    if (delayMs > 0) {
      console.log(`[Weather Service] Simulating ${delayMs}ms delay`);
      await new Promise((resolve) => setTimeout(resolve, delayMs));
    }
    
    if (Math.random() < failRate) {
      console.log(`[Weather Service] Simulating failure`);
      throw new HttpException(
        'Weather service temporarily unavailable',
        HttpStatus.SERVICE_UNAVAILABLE,
      );
    }

    console.log(`[Weather Service] Fetching forecast for ${city}`);

    const forecast = await this.weatherRepository.find({
      where: { destination: city },
      order: { date: 'ASC' },
    });

    return {
      city,
      forecast,
      source: 'Weather API v1',
    };
  }
}
