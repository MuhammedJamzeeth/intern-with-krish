import { Flight } from 'src/entities/flight.entity';

export class SearchFlightResponseDto {
  flights: Flight[];
  date: string;
}
