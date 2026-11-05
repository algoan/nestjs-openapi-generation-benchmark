import { ArgumentsHost, Catch, ExceptionFilter, HttpException, HttpStatus } from '@nestjs/common';
import { Response } from 'express';
import { ErrorCodes } from '../enums/error-codes.enum';
import { HttpError } from '../interfaces/http-error.interface';

/**
 * Format every error as `{ code, message, status }`
 */
@Catch()
export class HttpExceptionFilter implements ExceptionFilter {
  public catch(exception: unknown, host: ArgumentsHost): void {
    const response: Response = host.switchToHttp().getResponse();
    const status: number =
      exception instanceof HttpException ? exception.getStatus() : HttpStatus.INTERNAL_SERVER_ERROR;
    const exResponse: string | Record<string, unknown> =
      exception instanceof HttpException ? (exception.getResponse() as string | Record<string, unknown>) : '';

    const body: HttpError = {
      code: getCode(exResponse, status),
      message: getMessage(exResponse),
      status,
    };

    response.status(status).json(body);
  }
}

const getCode = (exResponse: string | Record<string, unknown>, status: number): string => {
  if (typeof exResponse === 'object' && typeof exResponse.code === 'string') {
    return exResponse.code;
  }

  return status === HttpStatus.BAD_REQUEST ? ErrorCodes.BAD_REQUEST : ErrorCodes.INTERNAL_SERVER_ERROR;
};

const getMessage = (exResponse: string | Record<string, unknown>): string => {
  if (typeof exResponse === 'string') {
    return exResponse === '' ? 'INTERNAL_SERVER_ERROR' : exResponse;
  }
  if (typeof exResponse.message === 'string') {
    return exResponse.message;
  }
  if (Array.isArray(exResponse.message) && typeof exResponse.message[0] === 'string') {
    return exResponse.message[0];
  }

  return 'INTERNAL_SERVER_ERROR';
};
