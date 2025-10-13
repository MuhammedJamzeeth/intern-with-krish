import { InjectRepository } from '@nestjs/typeorm';
import { Injectable } from '@nestjs/common';
import { Repository } from 'typeorm';
import { Hotel } from './entities/hotel.entity';

@Injectable()
export class AppService {

  constructor(
    @InjectRepository(Hotel)
    private hotelRepository: Repository<Hotel>,
  ) {}

  async searchHotels({ destination, date }: { destination: string; date: string }) {
    const results = await this.hotelRepository.find({
      where: { destination },
    });

    return {
      hotels: results,
      checkInDate: date,
    };
  }
}
