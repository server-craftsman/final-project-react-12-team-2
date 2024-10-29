import { StatusType } from "../../../../app/enums";

//==================INSTRUCTOR=======================
export interface GetCourseResponse {
  pageData: {
    _id: string;
    name: string;
    category_id: string;
    user_id: string;
    description: string;
    content: string;
    status: StatusType;
    video_url: string;
    image_url: string;
    price: number;
    discount: number;
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

export interface CreateCourseResponse {
  name: string;
  category_id: string;
  user_id: string;
  description: string;
  content: string;
  status: StatusType;
  video_url: string;
  image_url: string;
  price: number;
  discount: number;
  is_deleted: boolean;
  _id: string;
  created_at: Date;
  updated_at: Date;
  __v: number;
}

//==================CLIENT PUBLIC=======================
export interface GetPublicCourseResponse {
  pageData: GetCourseResponsePublic[];
  pageInfo: GetPublicCoursePageInfo;
}

export interface GetCourseResponsePublic {
  _id: string;
  name: string;
  category_id: string;
  category_name: string;
  status: string;
  description: string;
  video_url: string;
  image_url: string;
  price_paid: number;
  price: number;
  discount: number;
  full_time: number;
  average_rating: number;
  review_count: number;
  instructor_id: string;
  instructor_name: string;
  is_in_cart: boolean;
  is_purchased: boolean;
  session_count: number;
  lesson_count: number;
  created_at: Date;
  updated_at: Date;
  is_deleted: boolean;
}

export interface GetPublicCoursePageInfo {
  pageNum: number;
  pageSize: number;
  totalItems: number;
  totalPages: number;
}
