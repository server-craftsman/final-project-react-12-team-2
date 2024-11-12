export interface CreatePayoutResponseModel {
  _id: string;
  payout_no: string;
  status: string;
  instructor_id: string;
  instructor_ratio: number;
  balance_origin: number;
  balance_instructor_paid: number;
  balance_instructor_received: number;
  transactions: {
    _id: string;
    price_paid: number;
    price: number;
    discount: number;
    purchase_id: string;
  }[];
  created_at: Date;
  updated_at: Date;
  is_deleted: boolean;
}

export interface GetPayoutResponseModel {
  pageData: {
    _id: string;
    payout_no: string;
    status: string;
    instructor_id: string;
    instructor_ratio: number;
    balance_origin: number;
    balance_instructor_paid: number;
    balance_instructor_received: number;
    transactions: {
      _id: string;
      price_paid: number;
      price: number;
      discount: number;
      purchase_id: string;
      created_at: Date;
      updated_at: Date;
      is_deleted: boolean;
    }[];
  };
  pageInfo: {
    pageNum: number;
    pageSize: number;
    totalItems: number;
    totalPages: number;
  };
}
