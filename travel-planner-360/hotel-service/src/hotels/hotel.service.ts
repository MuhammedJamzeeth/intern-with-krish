import { InjectRepository } from '@nestjs/typeorm';
import { Injectable, Logger } from '@nestjs/common';
import { Repository } from 'typeorm';
import { Hotel } from 'src/entities/hotel.entity';
import { HotelNotFoundException } from 'src/exception/hotel-not-found-exception';

@Injectable()
export class HotelService {
  private readonly logger = new Logger(HotelService.name);

  constructor(
    @InjectRepository(Hotel)
    private hotelRepository: Repository<Hotel>,
  ) {}

  async searchHotels({
    destination,
    date,
  }: {
    destination: string;
    date: string;
  }) {
    const results = await this.hotelRepository.find({
      where: { destination, date },
    });

    if (results.length === 0) {
      throw new HotelNotFoundException(
        'No hotels found for the given destination and date',
      );
    }

    this.logger.debug(
      `Found ${results.length} hotels for destination: ${destination} and date: ${date}`,
    );

    return {
      hotels: results,
      checkInDate: date,
    };
  }
}
