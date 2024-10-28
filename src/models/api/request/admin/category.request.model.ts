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

export interface CreateCategoryParams {
  name: string;
  parent_category_id: string | null;
  description: string;
}
