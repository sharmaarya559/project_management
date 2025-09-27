import { Catch, HttpException } from '@nestjs/common';

@Catch(HttpException)
export class CustomException extends HttpException {
  constructor(message: string | object, status: number, cause?: Error) {
    super(message, status || 500, { cause });
  }
}
