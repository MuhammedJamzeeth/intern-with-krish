import { HttpException, HttpStatus } from '@nestjs/common';

export class FlightNotFoundException extends HttpException {
  constructor(message: string) {
    const msg = message || 'Flight not found';
    super(msg, HttpStatus.NOT_FOUND);
  }
}
