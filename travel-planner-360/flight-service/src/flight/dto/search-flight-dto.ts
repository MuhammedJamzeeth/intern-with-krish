import { IsNotEmpty, IsString, Matches } from 'class-validator';

export class SearchFlightDto {
  @IsString()
  @IsNotEmpty({
    message: 'Source airport is required',
  })
  from: string;

  @IsString()
  @IsNotEmpty({
    message: 'Destination airport is required',
  })
  to: string;

  @IsString()
  @IsNotEmpty({
    message: 'Departure date is required',
  })
  @Matches(/^\d{4}-\d{2}-\d{2}$/, {
    message: 'Date must be in YYYY-MM-DD format',
  })
  date: string;
}
