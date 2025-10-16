import { HttpException, HttpStatus } from '@nestjs/common';

export class NoForecastFoundException extends HttpException {
  constructor(city: string) {
    super(`No weather forecast found for city: ${city}`, HttpStatus.NOT_FOUND);
  }
}
