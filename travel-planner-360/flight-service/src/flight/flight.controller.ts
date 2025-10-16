import {
  Controller,
  Get,
  Logger,
  Query,
  UsePipes,
  ValidationPipe,
} from '@nestjs/common';
import { Flight } from 'src/entities/flight.entity';
import { FlightService } from './flight.service';
import { SearchFlightDto } from './dto/search-flight-dto';

@Controller('flights')
export class FlightController {
  private readonly logger = new Logger(FlightController.name);
  constructor(private readonly flightService: FlightService) {}

  @Get('search')
  @UsePipes(new ValidationPipe({ transform: true, whitelist: true }))
  async searchFlights(
    @Query() query: SearchFlightDto,
  ): Promise<{ flights: Flight[]; date: string }> {
    this.logger.debug(
      `Searching flights from ${query.from} to ${query.to} on ${query.date}`,
    );

    try {
      // await new Promise(resolve => setTimeout(resolve, 2000));

      const flights = await this.flightService.searchFlights({
        from: query.from,
        to: query.to,
        date: query.date,
      });

      return flights;
    } catch (error) {
      this.logger.error('Error searching flights', error.stack);
      throw error;
    }
  }
}
