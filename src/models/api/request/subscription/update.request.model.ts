export interface UpdateSubscriptionsParams {
  instructor_id: string;
}
export interface GetSubscriptionsParams {
  searchCondition: {
    keyword?: string;
    is_delete?: boolean | undefined;
  };
  pageInfo: {
    pageNum?: number;
    pageSize?: number;
  };
}
