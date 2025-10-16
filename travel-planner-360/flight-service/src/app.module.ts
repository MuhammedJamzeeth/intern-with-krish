import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Flight } from './entities/flight.entity';
import { FlightSeeder } from './seeds/flight.seeds';
import { FlightService } from './flight/flight.service';
import { FlightController } from './flight/flight.controller';

@Module({
  imports: [
    TypeOrmModule.forRoot({
      type: 'sqlite',
      database: 'flights.db',
      entities: [Flight],
      synchronize: true,
      logging: false,
    }),
    TypeOrmModule.forFeature([Flight]),
  ],
  controllers: [FlightController],
  providers: [FlightService, FlightSeeder],
})
export class AppModule {}
