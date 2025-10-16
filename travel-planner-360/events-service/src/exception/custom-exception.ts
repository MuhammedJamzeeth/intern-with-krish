import { HttpException, HttpStatus } from '@nestjs/common';

export class CustomException extends HttpException {
  constructor(message?: string) {
    super(
      {
        status: 'error',
        message: message || 'An unexpected error occurred',
      },
      HttpStatus.INTERNAL_SERVER_ERROR,
    );
  }
}
