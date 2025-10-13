import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Event } from './entities/event.entity';

@Injectable()
export class AppService {
   constructor(
    @InjectRepository(Event)
    private eventRepository: Repository<Event>,
  ) {}

  async searchEvents(
    destination: string,
    date: string,
  ) {
    const events = await this.eventRepository.find({
      where: {
        destination,
        active: true,
      },
    });

     return {
      events,
      destination,
    };
  
  }
}
