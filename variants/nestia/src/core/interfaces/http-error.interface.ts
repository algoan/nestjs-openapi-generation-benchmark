/**
 * Body sent by the global HttpExceptionFilter
 */
export interface HttpError {
  code: string;
  message: string;
  status: number;
}
