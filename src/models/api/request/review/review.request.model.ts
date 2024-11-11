export interface SearchForReviewRequestModel {
  searchCondition: {
    course_id: string;
    rating: number;
    is_instructor: boolean;
    is_rating_order: boolean;
    is_delete: boolean;
  };
  pageInfo: {
    pageNum: number;
    pageSize: number;
  };
}

export interface CreateReviewRequestModel {
  course_id: string;
  comment: string;
  rating: number;
}

export interface UpdateReviewRequestModel {
  course_id: string;
  comment: string;
  rating: number;
}
