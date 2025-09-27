import {
  Catch,
  HttpException,
  ExceptionFilter,
  ArgumentsHost,
} from '@nestjs/common';
import { Response } from 'express';

@Catch(HttpException)
export class CustomExceptionFilter implements ExceptionFilter {
  catch(exception: HttpException, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const res = ctx.getResponse<Response>();

    const status = exception.getStatus();
    const response = exception.getResponse();
    const cause = (exception as any).cause;
    let message: string | string[];
    if (typeof response === 'string') {
      message = response;
    } else if (typeof response === 'object' && response !== null) {
      message = (response as any).message || response;
    } else {
      message = 'Unexpected error';
    }

    return res.status(status).json({
      success: false,
      statusCode: status,
      message: cause?.message,
    });
  }
}
