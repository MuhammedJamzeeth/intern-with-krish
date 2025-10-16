import { IsNotEmpty, IsString } from 'class-validator';

export class FindForecastDto {
  @IsNotEmpty({
    message: 'Destination city must be provided',
  })
  @IsString()
  destination: string;
}
