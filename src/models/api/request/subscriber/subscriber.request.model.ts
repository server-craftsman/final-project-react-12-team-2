export interface GetSubscribersParams {
  searchCondition: {
    keyword?: string;
    is_delete?: boolean | undefined;
  };
  pageInfo: {
    pageNum?: number;
    pageSize?: number;
  };
}
