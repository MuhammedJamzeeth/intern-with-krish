import {
  Controller,
  Get,
  Logger,
  Query,
  UsePipes,
  ValidationPipe,
} from '@nestjs/common';
import { Hotel } from 'src/entities/hotel.entity';
import { HotelService } from './hotel.service';
import { SearchHotelDto } from './dto/search-hotel-dto';
import { HotelNotFoundException } from 'src/exception/hotel-not-found-exception';
import { UnexpectedErrorException } from 'src/exception/unexpected-error-exception';

@Controller('hotels')
export class HotelController {
  private readonly logger = new Logger(HotelController.name);
  constructor(private readonly hotelService: HotelService) {}

  @Get('search')
  @UsePipes(new ValidationPipe({ transform: true, whitelist: true }))
  async searchHotels(
    @Query() query: SearchHotelDto,
  ): Promise<{ hotels: Hotel[]; checkInDate: string }> {
    this.logger.debug(`Searching hotels with query: ${JSON.stringify(query)}`);

    try {
      return this.hotelService.searchHotels(query);
    } catch (error) {
      if (error instanceof HotelNotFoundException) {
        this.logger.warn(`Hotel not found: ${error.message}`);
        throw error;
      }

      this.logger.error(`Failed to search hotels: ${error.message}`);
      throw new UnexpectedErrorException();
    }
  }
}
