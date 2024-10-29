export interface SearchCondition {
  keyword: string;
  category_id: string;
  status: string;
  is_delete: boolean;
}

export interface PageInfo {
  pageNum: number;
  pageSize: number;
}

export interface GetCourseParams {
  searchCondition: SearchCondition;
  pageInfo: PageInfo;
}
