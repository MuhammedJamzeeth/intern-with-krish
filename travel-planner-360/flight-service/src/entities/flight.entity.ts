import { Entity, Column, PrimaryGeneratedColumn } from 'typeorm';

@Entity('flights')
export class Flight {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  airline: string;

  @Column()
  fromCity: string;

  @Column()
  toCity: string;

  @Column()
  departTime: string;

  @Column()
  arriveTime: string;

  @Column('decimal')
  price: number;

  @Column()
  duration: string;

  @Column({ default: true })
  available: boolean;

  @Column({ nullable: true })
  date: string;
}
