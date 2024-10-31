export interface Subscriptions {
  _id: string;
  instructor_id: string;
  instructor_name: string;
  subcriber_id: string;
  subcriber_name: string;
  is_subcribe?: boolean;
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
