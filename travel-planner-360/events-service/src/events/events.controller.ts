import {
  Controller,
  Get,
  Query,
  Logger,
  UsePipes,
  ValidationPipe,
} from '@nestjs/common';
import { EventsService } from './events.service';
import { SearchEventDto } from './dto/search-event.dto';

@Controller('events')
export class EventsController {
  private readonly logger = new Logger(EventsController.name);
  constructor(private readonly eventsService: EventsService) {}

  @Get('search')
  @UsePipes(new ValidationPipe({ transform: true, whitelist: true }))
  async searchEvents(@Query() searchEventDto: SearchEventDto) {
    const { destination, date } = searchEventDto;
    this.logger.debug(
      `search endpoint called destination=${destination} date=${date}`,
    );
    try {
      const res = await this.eventsService.searchEvents(searchEventDto);
      this.logger.debug(
        `search endpoint completed destination=${destination} found=${res.events?.length ?? 0}`,
      );
      return res;
    } catch (error) {
      this.logger.error(
        `search endpoint failed destination=${destination} date=${date}`,
        error?.stack ?? error,
      );
      throw error;
    }
  }
}
