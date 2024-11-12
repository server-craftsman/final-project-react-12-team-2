export interface CreatePayoutRequestModel {
    instructor_id: string;
    transactions: {
      purchase_id: string;
  }[];
}
