import { Injectable, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Flight } from 'src/entities/flight.entity';
import { Repository } from 'typeorm';

@Injectable()
export class FlightSeeder {
  private readonly logger = new Logger(FlightSeeder.name);

  constructor(
    @InjectRepository(Flight)
    private flightRepository: Repository<Flight>,
  ) {}

  async seed() {
    this.logger.log('Starting flight data seeding...');

    const existingFlights = await this.flightRepository.count();
    if (existingFlights > 0) {
      this.logger.log('Flights already seeded. Skipping...');
      return;
    }

    const flights = [
      {
        airline: 'SriLankan Airlines',
        fromCity: 'CMB',
        toCity: 'BKK',
        departTime: '08:00',
        arriveTime: '11:30',
        price: 250,
        duration: '3h 30m',
      },
      {
        airline: 'Thai Airways',
        fromCity: 'CMB',
        toCity: 'BKK',
        departTime: '14:00',
        arriveTime: '17:30',
        price: 180,
        duration: '3h 30m',
      },
      {
        airline: 'Air Asia',
        fromCity: 'CMB',
        toCity: 'BKK',
        departTime: '20:00',
        arriveTime: '23:30',
        price: 150,
        duration: '3h 30m',
      },
      {
        airline: 'Emirates',
        fromCity: 'CMB',
        toCity: 'SIN',
        departTime: '10:00',
        arriveTime: '16:00',
        price: 320,
        duration: '4h',
      },
      {
        airline: 'Singapore Airlines',
        fromCity: 'CMB',
        toCity: 'SIN',
        departTime: '15:00',
        arriveTime: '21:00',
        price: 380,
        duration: '4h',
      },
      {
        airline: 'IndiGo',
        fromCity: 'CMB',
        toCity: 'GOA',
        departTime: '09:00',
        arriveTime: '11:00',
        price: 120,
        duration: '2h',
      },
      {
        airline: 'Thai AirAsia',
        fromCity: 'BKK',
        toCity: 'HKT',
        departTime: '07:00',
        arriveTime: '08:30',
        price: 80,
        duration: '1h 30m',
      },
    ];

    for (const flightData of flights) {
      const flight = this.flightRepository.create(flightData);
      await this.flightRepository.save(flight);
    }

    this.logger.log(`Successfully seeded ${flights.length} flights`);
  }
}