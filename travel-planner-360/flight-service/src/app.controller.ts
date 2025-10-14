import { Controller, Get, Query } from '@nestjs/common';
import { AppService } from './app.service';
import { Flight } from './entities/flight.entity';

@Controller('flights')
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Get('search')
  async searchFlights(
    @Query() query: { from: string; to: string; date: string },
  ): Promise< { flights: Flight[]; date: string }> {

    // await new Promise(resolve => setTimeout(resolve, 2000));

    const flights = await this.appService.searchFlights({
      from: query.from,
      to: query.to,
      date: query.date,
    });

    return flights; ;
  }
}
