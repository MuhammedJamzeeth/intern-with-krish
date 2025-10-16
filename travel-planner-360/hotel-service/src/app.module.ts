import { TypeOrmModule } from '@nestjs/typeorm';
import { Module } from '@nestjs/common';
import { Hotel } from './entities/hotel.entity';
import { HotelSeeder } from './seeds/hotel.seeder';
import { HotelModule } from './hotels/hotel.module';

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
    HotelModule,
  ],
  providers: [HotelSeeder],
})
export class AppModule {}
