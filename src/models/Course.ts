export enum CourseStatusEnum {
  new,
  waiting_approve,
  approve,
  reject,
  active,
  inactive
}
export interface Course {
  id: string;
  name: string;
  category_id: string;
  user_id: string;
  description: string;
  content: string;
  status: CourseStatusEnum;
  video_url: string;
  image_url: string;
  price: number;
  discount: number;
  created_at: string;
  updated_at: string;
  is_deleted: boolean;
}