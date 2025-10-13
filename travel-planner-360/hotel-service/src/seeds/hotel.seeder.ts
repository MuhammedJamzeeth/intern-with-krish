import { Injectable, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Hotel } from 'src/entities/hotel.entity';
import { Repository } from 'typeorm';

@Injectable()
export class HotelSeeder {
  private readonly logger = new Logger(HotelSeeder.name);

  constructor(
    @InjectRepository(Hotel)
    private hotelRepository: Repository<Hotel>,
  ) {}

  async seed() {
    this.logger.log('Starting hotel data seeding...');

    const existingHotels = await this.hotelRepository.count();
    if (existingHotels > 0) {
      this.logger.log('Hotels already seeded. Skipping...');
      return;
    }

    const hotels = [
      {
        name: 'Bangkok Luxury Hotel',
        destination: 'BKK',
        rating: 4.5,
        pricePerNight: 120,
        lateCheckIn: true,
        amenities: ['Pool', 'Gym', 'WiFi'],
      },
      {
        name: 'Riverside Resort Bangkok',
        destination: 'BKK',
        rating: 4.8,
        pricePerNight: 180,
        lateCheckIn: true,
        amenities: ['Pool', 'Spa', 'Restaurant'],
      },
      {
        name: 'Budget Inn Bangkok',
        destination: 'BKK',
        rating: 3.5,
        pricePerNight: 60,
        lateCheckIn: false,
        amenities: ['WiFi'],
      },
      {
        name: 'Marina Bay Sands',
        destination: 'SIN',
        rating: 5.0,
        pricePerNight: 350,
        lateCheckIn: true,
        amenities: ['Pool', 'Casino', 'Spa', 'Fine Dining'],
      },
      {
        name: 'Singapore Budget Hotel',
        destination: 'SIN',
        rating: 3.8,
        pricePerNight: 90,
        lateCheckIn: false,
        amenities: ['WiFi', 'Breakfast'],
      },
      {
        name: 'Phuket Beach Resort',
        destination: 'HKT',
        rating: 4.7,
        pricePerNight: 200,
        lateCheckIn: true,
        amenities: ['Beach Access', 'Pool', 'Spa', 'Restaurant'],
      },
      {
        name: 'Goa Paradise Hotel',
        destination: 'GOA',
        rating: 4.3,
        pricePerNight: 110,
        lateCheckIn: true,
        amenities: ['Beach View', 'Pool', 'Bar'],
      },
    ];

    for (const hotelData of hotels) {
      const hotel = this.hotelRepository.create(hotelData);
      await this.hotelRepository.save(hotel);
    }

    this.logger.log(`Successfully seeded ${hotels.length} hotels`);
  }
}