import {
  Controller,
  Get,
  Logger,
  Query,
  UsePipes,
  ValidationPipe,
} from '@nestjs/common';
import { WeatherService } from './weather.service';
import { FindForecastDto } from './dto/find-forecast-dto';
import { UnexpectedErrorException } from 'src/exceptions/unexpected-error-exception';
import { NoForecastFoundException } from 'src/exceptions/no-forecast-found-exception';
import { FindForecastResponseDto } from './dto/find-forecast-response-dto';

@Controller('weather')
export class WeatherController {
  private readonly logger = new Logger(WeatherController.name);
  constructor(private readonly weatherService: WeatherService) {}

  @Get('forecast')
  @UsePipes(new ValidationPipe({ whitelist: true, transform: true }))
  getForecast(
    @Query() query: FindForecastDto,
  ): Promise<FindForecastResponseDto> {
    this.logger.debug(
      `Received forecast request for city: ${query.destination}`,
    );

    try {
      return this.weatherService.getForecast(query.destination);
      this.logger.debug(
        `Successfully retrieved forecast for city: ${query.destination}`,
      );
    } catch (error) {
      if (error instanceof NoForecastFoundException) {
        this.logger.warn(`No forecast found for city: ${query.destination}`);
        throw error;
      }

      this.logger.error(
        `Failed to get forecast for city: ${query.destination}`,
        error.stack,
      );
      throw new UnexpectedErrorException();
    }
  }
}
