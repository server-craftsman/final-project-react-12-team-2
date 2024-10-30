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
