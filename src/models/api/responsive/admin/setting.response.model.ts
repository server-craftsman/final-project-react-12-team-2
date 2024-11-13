export type Setting = {
  _id: string;
  balance: number;
  balance_total: number;
  transactions: Transaction[];
  created_at: Date;
  updated_at: Date;
  is_deleted: boolean;
};

export type Transaction = {
  _id: string;
  type: string;
  amount: string;
  balance_old: boolean;
  balance_new: string;
  instructor_ratio: string;
  payout_id: string;
  purchase_id: string;
  instructor_id: string;
  created_at: Date;
};
