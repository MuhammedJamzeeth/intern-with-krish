import { Controller, Get, Query } from '@nestjs/common';
import { AppService } from './app.service';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Get('forecast')
  getForecast(@Query('destination') destination: string) {
    return this.appService.getForecast(destination);
  }
}
