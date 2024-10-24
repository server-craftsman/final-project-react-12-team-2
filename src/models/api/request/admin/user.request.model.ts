export interface GetUsersAdminParams {
  searchCondition: {
    keyword?: string;
    role?: string;
    status?: boolean;
    is_verified?: boolean;
    is_delete?: boolean;
  };
  pageInfo: {
    pageNum?: number;
    pageSize?: number;
  };
}
