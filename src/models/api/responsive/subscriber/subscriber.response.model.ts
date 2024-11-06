export interface Subscriptions {
  _id: string;
  instructor_id: string;
  instructor_name: string;
  subscriber_id: string;
  subscriber_name: string;
  is_subscribed?: boolean;
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
export interface GetSubscribersResponse {
  pageData: Subscriptions[];
  pageInfo: PageInfo;
}
