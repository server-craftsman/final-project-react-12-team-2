export interface SearchForReviewResponseModel {
  pageData: {
    _id: string;
    course_id: string;
    course_name: string;
    reviewer_id: string;
    reviewer_name: string;
    comment: string;
    rating: number;
    created_at: Date;
    updated_at: Date;
    is_deleted: boolean;
  }[];
  pageInfo: {
    pageNum: number;
    pageSize: number;
    totalItems: number;
    totalPages: number;
  };
}

export interface GetReviewByIdResponseModel {
  _id: string;
  user_id: string;
  course_id: string;
  comment: string;
  rating: number;
  created_at: Date;
  updated_at: Date;
  is_deleted: boolean;
}

export interface CreateReviewResponseModel {
  _id: string;
  user_id: string;
  course_id: string;
  comment: string;
  rating: number;
  created_at: Date;
  updated_at: Date;
  is_deleted: boolean;
}

export interface UpdateReviewResponseModel {
  _id: string;
  user_id: string;
  course_id: string;
  comment: string;
  rating: number;
  created_at: Date;
  updated_at: Date;
  is_deleted: boolean;
}