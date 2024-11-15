export interface CreatePayoutRequestModel {
  instructor_id: string;
  transactions: {
    purchase_id: string;
  }[];
}

export interface GetPayoutRequestModel {
  searchCondition: {
    payout_no: string;
    instructor_id?: string;
    is_instructor: boolean;
    status: string;
    is_delete: boolean;
  };
  pageInfo: {
    pageNum: number;
    pageSize: number;
  };
}

export interface UpdatePayoutResponseModel {
  status: string;
  comment: string;
}
