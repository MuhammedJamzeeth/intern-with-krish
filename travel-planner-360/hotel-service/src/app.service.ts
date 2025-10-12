import { Injectable } from '@nestjs/common';
import { Hotel } from './index.types';

@Injectable()
export class AppService {
  private hotels: Hotel[] = [
    {
      id: 'HT001',
      name: 'Bangkok Luxury Hotel',
      destination: 'BKK',
      rating: 4.5,
      pricePerNight: 120,
      lateCheckIn: true,
      amenities: ['Pool', 'Gym', 'WiFi'],
    },
    {
      id: 'HT002',
      name: 'Riverside Resort Bangkok',
      destination: 'BKK',
      rating: 4.8,
      pricePerNight: 180,
      lateCheckIn: true,
      amenities: ['Pool', 'Spa', 'Restaurant'],
    },
    {
      id: 'HT003',
      name: 'Budget Inn Bangkok',
      destination: 'BKK',
      rating: 3.5,
      pricePerNight: 60,
      lateCheckIn: false,
      amenities: ['WiFi'],
    },
    {
      id: 'HT004',
      name: 'Marina Bay Sands',
      destination: 'SIN',
      rating: 5.0,
      pricePerNight: 350,
      lateCheckIn: true,
      amenities: ['Pool', 'Casino', 'Spa', 'Fine Dining'],
    },
  ];

  searchHotels({ destination, date }: { destination: string; date: string }): {
    hotels: Hotel[];
    checkInDate: string;
  } {
    const results = this.hotels.filter(
      (hotel) => hotel.destination === destination,
    );
    return {
      hotels: results,
      checkInDate: date,
    };
  }
}
