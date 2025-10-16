import { IsNotEmpty, IsString, Matches } from 'class-validator';

export class SearchHotelDto {
  @IsNotEmpty({
    message: 'Destination is required',
  })
  @IsString()
  destination: string;

  @IsNotEmpty({
    message: 'Date is required',
  })
  @IsString()
  @Matches(/^\d{4}-\d{2}-\d{2}$/, {
    message: 'Date must be in YYYY-MM-DD format',
  })
  date: string;
}
