/**
 * Body sent by the global HttpExceptionFilter
 */
export class HttpError {
  code: string;
  message: string;
  status: number;
}
