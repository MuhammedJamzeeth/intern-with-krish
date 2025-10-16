import { HttpException, HttpStatus } from '@nestjs/common';

export class HotelNotFoundException extends HttpException {
  constructor(message?: string) {
    super(message || 'Hotel not found', HttpStatus.NOT_FOUND);
  }
}
