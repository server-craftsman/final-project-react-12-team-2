export interface GetCategoryParams {
  searchCondition: {
    keyword: string;
    is_parent: boolean;
    is_delete: boolean;
  };
  pageInfo: {
    pageNum: number;
    pageSize: number;
  };
}
