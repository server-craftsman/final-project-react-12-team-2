export interface SessionResponse {
  pageData: {
    _id: string;
    name: string;
    user_id: string;
    course_id: string;
    description: string;
    position_order: number;
    created_at: Date;
    updated_at: Date;
    is_deleted: boolean;
  };
  pageInfo: {
    pageNum: number;
    pageSize: number;
    totalItems: number;
    totalPages: number;
  };
}
export interface CreateSessionResponse {
  _id: string;
  name: string;
  user_id: string;
  course_id: string;
  description: string;
  position_order: number;
  created_at: Date;
  updated_at: Date;
  is_deleted: boolean;
}
