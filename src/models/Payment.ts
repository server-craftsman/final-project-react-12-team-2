// models/Payment.ts
export interface Payment {
    id: string;
    reference: string;
    amount: number;
    date: string;
    status: boolean;
    description: string;
  }
  
  export interface PaymentsData {
    payments: Payment[];
  }
  