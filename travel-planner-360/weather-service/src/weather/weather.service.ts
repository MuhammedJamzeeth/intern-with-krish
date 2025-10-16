import { InjectRepository } from '@nestjs/typeorm';
import { HttpException, HttpStatus, Injectable, Logger } from '@nestjs/common';
import { Repository } from 'typeorm';
import { WeatherForecast } from 'src/entities/weather.entity';
import { NoForecastFoundException } from 'src/exceptions/no-forecast-found-exception';
import { FindForecastResponseDto } from './dto/find-forecast-response-dto';

@Injectable()
export class WeatherService {
  private readonly logger = new Logger(WeatherService.name);
  constructor(
    @InjectRepository(WeatherForecast)
    private weatherRepository: Repository<WeatherForecast>,
  ) {}

  async getForecast(city: string): Promise<FindForecastResponseDto> {
    const delayMs = parseInt(process.env.WEATHER_DELAY_MS || '2000', 10);
    const failRate = parseFloat(process.env.WEATHER_FAIL_RATE || '0');

    if (delayMs > 0) {
      this.logger.debug(`[Weather Service] Simulating ${delayMs}ms delay`);
      await new Promise((resolve) => setTimeout(resolve, delayMs));
    }

    if (Math.random() < failRate) {
      this.logger.error(`[Weather Service] Simulating failure`);
      throw new HttpException(
        'Weather service temporarily unavailable',
        HttpStatus.SERVICE_UNAVAILABLE,
      );
    }

    this.logger.debug(`[Weather Service] Fetching forecast for ${city}`);

    const forecast = await this.weatherRepository.find({
      where: { destination: city },
      order: { date: 'ASC' },
    });

    if (forecast.length === 0) {
      this.logger.warn(`[Weather Service] No forecast found for ${city}`);
      throw new NoForecastFoundException(city);
    }

    return {
      city,
      forecast,
      source: 'Weather API v1',
    };
  }
}
