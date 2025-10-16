import { InjectRepository } from '@nestjs/typeorm';
import { Injectable, Logger } from '@nestjs/common';
import { Repository } from 'typeorm';
import { Flight } from 'src/entities/flight.entity';
import { SearchFlightResponseDto } from './dto/search-flight-response-dto';
import { FlightNotFoundException } from 'src/exceptions/flight-not-found-exception';

@Injectable()
export class FlightService {
  private readonly logger = new Logger(FlightService.name);
  constructor(
    @InjectRepository(Flight) private flightRepository: Repository<Flight>,
  ) {}

  async searchFlights({
    from,
    to,
    date,
  }: {
    from: string;
    to: string;
    date: string;
  }): Promise<SearchFlightResponseDto> {
    const flights = await this.flightRepository.find({
      where: { fromCity: from, toCity: to, date, available: true },
    });

    if (flights.length === 0) {
      throw new FlightNotFoundException(
        'No flights found for the given criteria',
      );
    }

    this.logger.debug(
      `Found ${flights.length} flights from ${from} to ${to} on ${date}`,
    );

    return {
      flights,
      date,
    };
  }
}
