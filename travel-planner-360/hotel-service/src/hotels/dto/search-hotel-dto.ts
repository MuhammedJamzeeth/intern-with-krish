import {
  IsNotEmpty,
  IsOptional,
  IsString,
  Matches,
  IsBoolean,
} from 'class-validator';
import { Transform } from 'class-transformer';

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

  @IsOptional()
  @IsBoolean()
  @Transform(({ value }) => {
    if (value === 'true') return true;
    if (value === 'false') return false;
    return value;
  })
  lateCheckIn?: boolean;
}
