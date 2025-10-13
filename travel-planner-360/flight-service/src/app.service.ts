import { InjectRepository } from '@nestjs/typeorm';
import { Injectable } from '@nestjs/common';
import { Flight } from './entities/flight.entity';
import { Repository } from 'typeorm';


@Injectable()
export class AppService {

  constructor(@InjectRepository(Flight) private flightRepository: Repository<Flight>) {}

  async searchFlights({
    from,
    to,
    date,
  }: {
    from: string;
    to: string;
    date: string;
  }): Promise<{ flights: Flight[]; date: string }> {
    
    const flights = await this.flightRepository.find({
      where: { fromCity: from, toCity: to, available: true },
    });
    return {
      flights,
      date
    };
  }
}
