import { WeatherForecast } from 'src/entities/weather.entity';

export class FindForecastResponseDto {
  city: string;
  forecast: WeatherForecast[];
  source: string;
}
