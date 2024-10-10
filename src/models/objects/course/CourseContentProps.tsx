export interface CourseContentProps {
    sessions: any[];
    lessons: any[];
    courseId: string;
    activeSessionId: string | null;
    setActiveSessionId: (id: string | null) => void;
  }