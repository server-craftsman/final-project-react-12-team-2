import { useCallback, useState } from "react";
import { SessionService } from "../services/session/session.service";
import { CourseService } from "../services/course/course.service";
import { LessonService } from "../services/lesson/lesson.service";
import { SessionRequestModel } from "../models/api/request/session/session.request.model";
import { GetCourseParams } from "../models/api/request/course/course.request.model";
import { GetLessonParams } from "../models/api/request/lesson/lesson.request.model";
// import { create } from "zustand";

// Add course store
// interface CourseStore {
//   refreshCourses: () => Promise<void>;
//   setRefreshCourses: (refresh: () => Promise<void>) => void;
// }

// // Add session store
// interface SessionStore {
//   refreshSessions: () => Promise<void>;
//   setRefreshSessions: (refresh: () => Promise<void>) => void;
// }

// // Add lesson store
// interface LessonStore {
//   refreshLessons: () => Promise<void>;
//   setRefreshLessons: (refresh: () => Promise<void>) => void;
// }

// export const useCourseStore = create<CourseStore>((set) => ({
//   refreshCourses: async () => {},
//   setRefreshCourses: (refresh) => set({ refreshCourses: refresh })
// }));

// export const useSessionStore = create<SessionStore>((set) => ({
//   refreshSessions: async () => {},
//   setRefreshSessions: (refresh) => set({ refreshSessions: refresh })
// }));

// export const useLessonStore = create<LessonStore>((set) => ({
//   refreshLessons: async () => {},
//   setRefreshLessons: (refresh) => set({ refreshLessons: refresh })
// }));

//optimize to call api one time
export const useCallbackCourse = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);
  const [data, setData] = useState<any>(null);

  const getCourse = useCallback(async (customParams?: Partial<GetCourseParams>) => {
    const defaultParams: GetCourseParams = {
      searchCondition: {
        keyword: "",
        category_id: "",
        status: "",
        is_delete: false
      },
      pageInfo: {
        pageNum: 1,
        pageSize: 100
      }
    };

    try {
      setLoading(true);
      setError(null);
      const response = await CourseService.getCourse({
        ...defaultParams,
        ...customParams
      });
      setData(response.data.data.pageData || []);
      return { data: response.data.data.pageData || [], loading: false, error: null };
    } catch (err) {
      setError(err as Error);
      return { data: null, loading: false, error: err };
    } finally {
      setLoading(false);
    }
  }, []);

  // Add store setter

  return {
    getCourse,
    courseData: data,
    courseLoading: loading,
    courseError: error
  };
};

export const useCallbackSession = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);
  const [data, setData] = useState<any>(null);

  const getSession = useCallback(async (customParams?: Partial<SessionRequestModel>) => {
    const defaultParams: SessionRequestModel = {
      searchCondition: {
        keyword: "",
        course_id: "",
        is_delete: false,
        is_position_order: false
      },
      pageInfo: {
        pageNum: 1,
        pageSize: 100
      }
    };

    try {
      setLoading(true);
      setError(null);
      const response = await SessionService.getSession({
        ...defaultParams,
        ...customParams
      });
      setData(response.data.data.pageData || []);
      return { data: response.data.data.pageData || [], loading: false, error: null };
    } catch (err) {
      setError(err as Error);
      return { data: null, loading: false, error: err };
    } finally {
      setLoading(false);
    }
  }, []);

  // Add store setter

  return {
    getSession,
    sessionData: data,
    sessionLoading: loading,
    sessionError: error
  };
};

export const useCallbackLesson = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);
  const [data, setData] = useState<any>(null);

  const getLesson = useCallback(async (customParams?: Partial<GetLessonParams>) => {
    const defaultParams: GetLessonParams = {
      searchCondition: {
        keyword: "",
        course_id: "",
        is_delete: false,
        is_position_order: false
      },
      pageInfo: {
        pageNum: 1,
        pageSize: 100
      }
    };

    try {
      setLoading(true);
      setError(null);
      const response = await LessonService.getLesson({
        ...defaultParams,
        ...customParams
      });
      setData(response.data.data.pageData || []);
      return { data: response.data.data.pageData || [], loading: false, error: null };
    } catch (err) {
      setError(err as Error);
      return { data: null, loading: false, error: err };
    } finally {
      setLoading(false);
    }
  }, []);

  // Add store setter

  return {
    getLesson,
    lessonData: data,
    lessonLoading: loading,
    lessonError: error
  };
};
