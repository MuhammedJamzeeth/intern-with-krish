import {
  HttpException,
  HttpStatus,
  Injectable,
} from '@nestjs/common';

@Injectable()
export class AppService {
  private weatherData = {
    BKK: [
      { date: '2025-12-10', tempMin: 24, tempMax: 33, condition: 'Sunny' },
      {
        date: '2025-12-11',
        tempMin: 25,
        tempMax: 34,
        condition: 'Partly Cloudy',
      },
      { date: '2025-12-12', tempMin: 24, tempMax: 32, condition: 'Rainy' },
      {
        date: '2025-12-13',
        tempMin: 23,
        tempMax: 31,
        condition: 'Thunderstorms',
      },
      { date: '2025-12-14', tempMin: 24, tempMax: 33, condition: 'Sunny' },
      { date: '2025-12-15', tempMin: 25, tempMax: 34, condition: 'Sunny' },
      {
        date: '2025-12-16',
        tempMin: 24,
        tempMax: 33,
        condition: 'Partly Cloudy',
      },
    ],
    SIN: [
      { date: '2025-12-10', tempMin: 26, tempMax: 31, condition: 'Humid' },
      { date: '2025-12-11', tempMin: 26, tempMax: 32, condition: 'Rainy' },
      { date: '2025-12-12', tempMin: 25, tempMax: 30, condition: 'Cloudy' },
      { date: '2025-12-13', tempMin: 26, tempMax: 31, condition: 'Sunny' },
      { date: '2025-12-14', tempMin: 26, tempMax: 32, condition: 'Humid' },
      {
        date: '2025-12-15',
        tempMin: 25,
        tempMax: 31,
        condition: 'Partly Cloudy',
      },
      { date: '2025-12-16', tempMin: 26, tempMax: 31, condition: 'Rainy' },
    ],
  };

  async getForecast(city: string) {
    const delayMs = parseInt(process.env.WEATHER_DELAY_MS || '0', 10);
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

    const forecast = this.weatherData[city] || [];

    return {
      city,
      forecast,
      source: 'Weather API v1',
    };
  }
}
