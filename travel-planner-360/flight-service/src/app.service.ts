import { Injectable } from '@nestjs/common';
import { Flight } from './index.types';



@Injectable()
export class AppService {
  private flights: Flight[] = [
    {
      id: 'FL001',
      airline: 'SriLankan Airlines',
      from: 'CMB',
      to: 'BKK',
      departTime: '08:00',
      arriveTime: '11:30',
      price: 250,
      duration: '3h 30m',
    },
    {
      id: 'FL002',
      airline: 'Thai Airways',
      from: 'CMB',
      to: 'BKK',
      departTime: '14:00',
      arriveTime: '17:30',
      price: 180,
      duration: '3h 30m',
    },
    {
      id: 'FL003',
      airline: 'Air Asia',
      from: 'CMB',
      to: 'BKK',
      departTime: '20:00',
      arriveTime: '23:30',
      price: 150,
      duration: '3h 30m',
    },
    {
      id: 'FL004',
      airline: 'Emirates',
      from: 'CMB',
      to: 'SIN',
      departTime: '10:00',
      arriveTime: '16:00',
      price: 320,
      duration: '4h',
    },
  ];

  searchFlights({
    from,
    to,
    date,
  }: {
    from: string;
    to: string;
    date: string;
  }): Flight[] {
    return this.flights.filter(
      (flight) =>
        flight.from === from && flight.to === to && flight.departTime === date,
    );
  }
}
