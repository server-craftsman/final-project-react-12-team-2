export interface CourseLog {
    _id: string;
    user_id: string;
    user_name: string;
    course_id: string;
    course_name: string;
    old_status: string;
    new_status: string;
    comment: string;
    created_at: Date;
    is_deleted: boolean;
}

export interface PageInfo {
  pageNum: number;
  pageSize: number;
  totalItems: number;
  totalPages: number;
}

export interface GetCoursesLogsResponse {
  pageData: CourseLog[];
  pageInfo: PageInfo;
}

