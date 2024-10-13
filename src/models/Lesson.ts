export enum LessonType {
  video,
  image,
  text,
}

export interface Lesson {
  id: string;
  name: string;
  course_id: string;
  session_id: string;
  user_id: string;
  lesson_type: LessonType;
  description: string;
  video_url: string;
  image_url: string;
  full_time: number;
  position_order: number;
  created_at: string;
  updated_at: string;
  is_deleted: boolean;
}
