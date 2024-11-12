export interface SearchForStudentPurchaseResponseModel {
  pageData: {
    _id: string;
    purchase_no: string;
    status: string;
    price_paid: number;
    price: number;
    discount: number;
    cart_id: string;
    cart_no: string;
    course_id: string;
    course_name: string;
    student_id: string;
    student_name: string;
    instructor_id: string;
    instructor_name: string;
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

export interface SearchForInstructorPurchaseResponseModel {
  pageData: {
    _id: string;
    purchase_no: string;
    status: string;
    price_paid: number;
    price: number;
    discount: number;
    cart_id: string;
    cart_no: string;
    course_id: string;
    course_name: string;
    student_id: string;
    student_name: string;
    instructor_id: string;
    instructor_name: string;
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
