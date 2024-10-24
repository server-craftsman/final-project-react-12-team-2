export enum PurchaseStatusEnum {
  new = "new",
  request_paid = "request_paid",
  completed = "completed",
}

export interface Purchases {
  id: string;
  purchase_no: string;
  status: PurchaseStatusEnum;
  price_paid: number;
  price: number;
  discount: number;
  cart_id: string;
  created_at: Date;
  updated_at: Date;
  is_deleted: boolean;
}
