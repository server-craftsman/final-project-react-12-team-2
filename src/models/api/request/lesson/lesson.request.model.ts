import { LessonType } from "../../../../app/enums/lesson.enum";

export interface CreateLessonRequest {
  name: string;
  course_id: string;
  session_id: string;
  lesson_type: LessonType;
  description: string;
  video_url: string;
  image_url: string;
  full_time: number;
  position_order: number;
}

export interface GetLessonParams {
  searchCondition: SearchLessonCondition;
  pageInfo: LessonPageInfo;
}

export interface SearchLessonCondition {
  keyword: string;
  course_id: string;
  is_position_order: boolean;
  is_delete: boolean;
}
export interface LessonPageInfo {
  pageNum: number;
  pageSize: number;
}
