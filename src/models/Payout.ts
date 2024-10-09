// models/Payment.ts
export enum PayoutStatusEnum {
  COMPLETED = 'completed',
  PENDING = 'pending',
  REJECT = 'reject'
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
created_at: Date
updated_at: Date
is_deleted: boolean 
  }
  
  // export interface PaymentsData {
  //   payments: Payment[];
  // }
  