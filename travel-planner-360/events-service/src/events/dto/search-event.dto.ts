import { IsOptional, IsString, IsNotEmpty, Matches } from 'class-validator';

export class SearchEventDto {
  @IsOptional()
  @IsString()
  @IsNotEmpty()
  destination?: string;

  @IsOptional()
  @IsString()
  @Matches(/^\d{4}-\d{2}-\d{2}$/, {
    message: 'Date must be in YYYY-MM-DD format',
  })
  date?: string;
}
