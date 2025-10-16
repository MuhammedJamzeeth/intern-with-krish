import { HttpException, HttpStatus } from '@nestjs/common';

export class EventNotFoundException extends HttpException {
  constructor(destination?: string, date?: string) {
    const message = `No events found${destination ? ` for destination: ${destination}` : ''}${date ? ` on date: ${date}` : ''}`;
    super(
      {
        status: 'error',
        message,
        errorCode: 'EVENT_NOT_FOUND',
      },
      HttpStatus.NOT_FOUND,
    );
  }
}
