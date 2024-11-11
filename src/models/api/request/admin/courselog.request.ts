export interface GetCourseLogParams {
  searchCondition: {
    course_id: string;
    keyword: string;
    category_id: string;
    status: string;
    is_delete: boolean;
  };
  pageInfo: {
    pageNum: number;
    pageSize: number;
  };
}
