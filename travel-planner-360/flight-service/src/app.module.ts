import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Flight } from './entities/flight.entity';
import { FlightSeeder } from './seeds/flight.seeds';

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
  controllers: [AppController],
  providers: [AppService, FlightSeeder],
})
export class AppModule {}
