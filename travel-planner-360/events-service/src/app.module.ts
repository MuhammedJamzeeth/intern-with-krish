import { EventsService } from './events/events.service';
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Event } from './entities/event.entity';
import { EventsModule } from './events/events.module';
import { EventSeeder } from './seeds/event.seeder';

@Module({
  imports: [
    TypeOrmModule.forRoot({
      type: 'sqlite',
      database: 'events.db',
      entities: [Event],
      synchronize: true,
      logging: false,
    }),
    TypeOrmModule.forFeature([Event]),
    EventsModule,
  ],
  controllers: [],
  providers: [EventSeeder, EventsService],
})
export class AppModule {}
