import { SessionService } from "../services/session/session.service";
import { CourseService } from "../services/course/course.service";
import { LessonService } from "../services/lesson/lesson.service";
export const useCallbackSession = () => {
  const getSession = SessionService.getSession;
  return { getSession };
};

export const useCallbackCourse = () => {
  const getCourse = CourseService.getCourse;
  return { getCourse };
};

export const useCallbackLesson = () => {
  const getLesson = LessonService.getLesson;
  return { getLesson };
};
