// models/Payment.ts
export enum PayoutStatusEnum {
  new = "NEW",
  request_payout = "REQUEST_PAYOUT",
  completed = "COMPLETED",
  rejected = "REJECTED",
}
export interface Payout {
  id: string;
  payout_no: string;
  status: PayoutStatusEnum;
  instructor_id: string;
  instructor_ratio: number;
  balance_origin: number;
  balance_instructor_paid: number;
  balance_instructor_received: number;
  created_at: string;
  updated_at: string;
  is_deleted: boolean;
}
