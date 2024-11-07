export interface Subscriptions {
  _id: string;
  subscriber_id: string;
  instructor_id: string;
  is_subscribed: boolean;
  created_at: Date;
  updated_at: Date;
  is_deleted: boolean;
}
export interface PageInfo {
  pageNum: number;
  pageSize: number;
  totalItems: number;
  totalPages: number;
}
export interface GetSubscriptionsResponse {
  pageData: Subscriptions[];
  pageInfo: PageInfo;
}
