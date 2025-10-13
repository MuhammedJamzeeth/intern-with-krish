import { Controller, Get, Query } from '@nestjs/common';
import { AppService } from './app.service';

@Controller('events')
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Get('search')
  async searchEvents(
    @Query('destination') destination: string,
    @Query('date') date: string,
  ) {
    return this.appService.searchEvents(destination, date);
  }
}
