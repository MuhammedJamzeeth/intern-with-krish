import { Flight } from './index.types';
import { Controller, Get, Query } from '@nestjs/common';
import { AppService } from './app.service';

@Controller('flights')
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Get('search')
  searchFlights(
    @Query() query: { from: string; to: string; date: string },
  ): Flight[] {
    return this.appService.searchFlights({
      from: query.from,
      to: query.to,
      date: query.date,
    });
  }
}
