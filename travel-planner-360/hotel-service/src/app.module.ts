import { TypeOrmModule } from '@nestjs/typeorm';
import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { Hotel } from './entities/hotel.entity';
import { HotelSeeder } from './seeds/hotel.seeder';

@Module({
  imports: [
    TypeOrmModule.forRoot({
      type: 'sqlite',
      database: 'hotels.db',
      entities: [Hotel],
      synchronize: true,
      logging: false,
    }),
    TypeOrmModule.forFeature([Hotel]),
  
  ],
  controllers: [AppController],
  providers: [AppService, HotelSeeder],
})
export class AppModule {}
