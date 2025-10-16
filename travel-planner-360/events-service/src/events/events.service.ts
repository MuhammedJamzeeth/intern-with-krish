import { Injectable, Logger, BadRequestException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Event } from '../entities/event.entity';
import { CustomException } from '../exception/custom-exception';
import { EventNotFoundException } from '../exception/event-not-found.exception';
import { SearchEventDto } from './dto/search-event.dto';
import { SearchEventResponseDto } from './dto/search-event-response.dto';

@Injectable()
export class EventsService {
  private readonly logger = new Logger(EventsService.name);
  constructor(
    @InjectRepository(Event)
    private eventRepository: Repository<Event>,
  ) {}

  async searchEvents(
    searchEventDto: SearchEventDto,
  ): Promise<SearchEventResponseDto> {
    const { destination, date } = searchEventDto;

    this.logger.debug(
      `searchEvents called destination=${destination} date=${date}`,
    );

    // Validate that at least one search parameter is provided
    if (!destination && !date) {
      throw new BadRequestException(
        'At least one search parameter (destination or date) must be provided',
      );
    }

    try {
      const events = await this.eventRepository.find({
        where: {
          ...(destination ? { destination } : {}),
          ...(date ? { date } : {}),
        },
      });

      this.logger.debug(
        `searchEvents found ${events.length} events for destination=${destination}, date=${date}`,
      );

      // Throw exception if no events found
      if (events.length === 0) {
        throw new EventNotFoundException(destination, date);
      }

      return {
        events,
        destination,
        date,
        total: events.length,
      };
    } catch (err) {
      if (
        err instanceof BadRequestException ||
        err instanceof EventNotFoundException
      ) {
        throw err;
      }

      this.logger.error('searchEvents failed', err?.stack ?? err);
      throw new CustomException(err?.message ?? 'Failed to search events');
    }
  }
}
