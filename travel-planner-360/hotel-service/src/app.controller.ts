import { Controller, Get, Query } from '@nestjs/common';
import { AppService } from './app.service';
import { Hotel } from './index.types';

@Controller('hotels')
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Get('search')
 async searchHotels(
    @Query('destination') destination: string,
    @Query('date') date: string,
  ): Promise<{ hotels: Hotel[]; checkInDate: string }> {
    return this.appService.searchHotels({ destination, date });
  }
}
