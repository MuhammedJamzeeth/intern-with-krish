import { Entity, Column, PrimaryGeneratedColumn } from 'typeorm';

@Entity('hotels')
export class Hotel {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  name: string;

  @Column()
  destination: string;

  @Column('decimal')
  rating: number;

  @Column('decimal')
  pricePerNight: number;

  @Column({ default: false })
  lateCheckIn: boolean;

  @Column('simple-array')
  amenities: string[];

  @Column({ default: true })
  available: boolean;

  @Column()
  date: string;
}
