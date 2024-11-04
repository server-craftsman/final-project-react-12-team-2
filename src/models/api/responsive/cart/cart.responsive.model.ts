export interface CreateCartResponse {
  _id: string;
  cart_no: string;
  status: string;
  price: number;
  discount: number;
  course_id: string;
  student_id: string;
  instructor_id: string;
  created_at: Date;
  updated_at: Date;
  is_deleted: boolean;
}

export interface GetCartItemsResponse {
  pageData: {
    _id: string;
    cart_no: string;
    status: string;
    price: number;
    discount: number;
    course_id: string;
    student_id: string;
    instructor_id: string;
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
