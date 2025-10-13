import { Entity, Column, PrimaryGeneratedColumn } from 'typeorm';

@Entity('weather_forecasts')
export class WeatherForecast {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  destination: string;

  @Column()
  date: string;

  @Column()
  tempMin: number;

  @Column()
  tempMax: number;

  @Column()
  condition: string;
}