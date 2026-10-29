import { AdoptionRequestStatus } from '../enums/adoption-request-status.enum';

/**
 * Receipt returned when an adoption request is filed
 * @openapi
 * components:
 *   schemas:
 *     AdoptionReceipt:
 *       type: object
 *       required: [adoptionId, status, expectedDecisionDate]
 *       properties:
 *         adoptionId:
 *           type: string
 *         status:
 *           $ref: '#/components/schemas/AdoptionRequestStatus'
 *         expectedDecisionDate:
 *           type: string
 *           format: date-time
 *           description: When the shelter commits to answer
 */
export interface AdoptionReceipt {
  adoptionId: string;
  status: AdoptionRequestStatus;
  /**
   * When the shelter commits to answer
   */
  expectedDecisionDate: Date;
}
