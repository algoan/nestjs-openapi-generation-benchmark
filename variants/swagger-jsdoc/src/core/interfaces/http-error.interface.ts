/**
 * Body sent by the global HttpExceptionFilter
 * @openapi
 * components:
 *   schemas:
 *     HttpError:
 *       type: object
 *       required: [code, message, status]
 *       properties:
 *         code:
 *           type: string
 *         message:
 *           type: string
 *         status:
 *           type: number
 */
export interface HttpError {
  code: string;
  message: string;
  status: number;
}
