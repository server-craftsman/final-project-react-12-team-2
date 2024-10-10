// models/Payment.ts
export enum PayoutStatusEnum {
  COMPLETED = 'COMPLETED',
  REQUEST_PAYOUT = 'REQUEST_PAYOUT',
  REJECT = 'REJECTED'
}

export interface Payout {
id: string
payout_no: string
status: PayoutStatusEnum
instructor_id: string
instructor_ratio: number
balance_origin: number
balance_instructor_paid: number
balance_instructor_received: number
created_at: string
updated_at: string
is_deleted: boolean 
  }
  
  // export interface PaymentsData {
  //   payments: Payment[];
  // }
  