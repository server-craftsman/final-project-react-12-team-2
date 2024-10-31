export interface SearchCondition {
  keyword: string;
  category_id: string;
  status: string;
  is_delete: boolean;
}

export interface PageInfo {
  pageNum: number;
  pageSize: number;
}

export interface GetCourseParams {
  searchCondition: SearchCondition;
  pageInfo: PageInfo;
}

export interface CreateCourseParams {
  name: string;
  category_id: string;
  description: string;
  content: string;
  video_url: string;
  image_url: string;
  price: number;
  discount: number;
}

export interface ChangeStatusCourseParams {
  course_id: string;
  new_status: string;
  comment: string;
}

export interface UpdateCourseParams {
  name: string;
  category_id: string;
  description: string;
  content: string;
  video_url: string;
  image_url: string;
  price: number;
  discount: number;
}

//==================CLIENT PUBLIC=======================

export interface GetPublicCourseParams {
  searchCondition: SearchCondition;
  pageInfo: PageInfo;
}
