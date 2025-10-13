import { Entity, Column, PrimaryGeneratedColumn } from 'typeorm';

@Entity('events')
export class Event {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  name: string;

  @Column()
  destination: string;

  @Column()
  date: string;

  @Column()
  category: string;

  @Column()
  description: string;

  @Column({ default: true })
  active: boolean;
}