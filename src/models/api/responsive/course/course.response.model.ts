import { StatusType } from "../../../../app/enums";

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
