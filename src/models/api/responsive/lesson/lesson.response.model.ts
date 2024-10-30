import { LessonType } from "../../../../app/enums";

export interface CreateLessonResponse {
  pageData: {
    _id: string;
    name: string;
    course_id: string;
    course_name: string;
    session_id: string;
    session_name: string;
    user_id: string;
    user_name: string;
    lesson_type: LessonType;
    description: string;
    video_url: string;
    image_url: string;
    full_time: number;
    position_order: number;
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

export interface Lesson {
  pageData: {
    _id: string;
    name: string;
    course_id: string;
    course_name: string;
    session_id: string;
    session_name: string;
    user_id: string;
    user_name: string;
    lesson_type: LessonType;
    description: string;
    video_url: string;
    image_url: string;
    full_time: number;
    position_order: number;
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
