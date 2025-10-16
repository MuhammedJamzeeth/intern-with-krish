import { Injectable, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Event } from '../entities/event.entity';
import { Repository } from 'typeorm';

@Injectable()
export class EventSeeder {
  private readonly logger = new Logger(EventSeeder.name);

  constructor(
    @InjectRepository(Event)
    private eventRepository: Repository<Event>,
  ) {}

  async seed() {
    this.logger.debug('Starting event data seeding...');

    const existingEvents = await this.eventRepository.count();
    if (existingEvents > 0) {
      this.logger.debug('Events already seeded. Skipping...');
      return;
    }

    const events = [
      {
        name: 'Phuket Beach Festival',
        destination: 'HKT',
        date: '2025-12-15',
        category: 'Beach',
        description: 'Annual beach music and food festival',
      },
      {
        name: 'Phuket International Boat Show',
        destination: 'HKT',
        date: '2025-12-18',
        category: 'Exhibition',
        description: 'Luxury yacht and marine equipment showcase',
      },
      {
        name: 'Pattaya Fireworks Festival',
        destination: 'UTP',
        date: '2025-12-20',
        category: 'Beach',
        description: 'International fireworks competition',
      },
      {
        name: 'Bangkok Art Week',
        destination: 'BKK',
        date: '2025-12-10',
        category: 'Culture',
        description: 'Contemporary art exhibitions across the city',
      },
      {
        name: 'Bangkok Food Festival',
        destination: 'BKK',
        date: '2025-12-14',
        category: 'Food',
        description: 'Street food and fine dining showcase',
      },
      {
        name: 'Goa Sunburn Festival',
        destination: 'GOA',
        date: '2025-12-28',
        category: 'Beach',
        description: "Asia's biggest electronic dance music festival",
      },
      {
        name: 'Singapore Night Festival',
        destination: 'SIN',
        date: '2025-12-12',
        category: 'Culture',
        description: 'Night-time cultural celebration with light installations',
      },
    ];

    for (const eventData of events) {
      try {
        const event = this.eventRepository.create(eventData);
        await this.eventRepository.save(event);
        this.logger.debug(`seeded event ${event.name} (${event.destination})`);
      } catch (err) {
        this.logger.error('Failed to seed event', err?.stack ?? err);
        throw err;
      }
    }

    this.logger.debug(`Successfully seeded ${events.length} events`);
  }
}
