import { Event } from '../../entities/event.entity';

export class SearchEventResponseDto {
  events: Event[];
  destination?: string;

  date?: string;

  total: number;
}
