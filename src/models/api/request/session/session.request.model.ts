export interface SessionRequestModel {
  searchCondition: {
    keyword: string;
    course_id: string;
    is_position_order: boolean;
    is_delete: boolean;
  };
  pageInfo: {
    pageNum: number;
    pageSize: number;
  };
}

export interface CreateSessionRequestModel {
  name: string;
  course_id: string;
  position_order: number;
  description: string;
}
