import { lazy } from 'react'
import { RouteObject } from 'react-router-dom'
import DashboardStudent from '../pages/student/overview/DashboardStudent'
import StudentProfile from '../components/student/setting/StudentProfile'
import StudentSubcription from '../components/student/setting/StudentSubcription'
import StudentOrders from '../components/student/setting/StudentOrders'
const StudentLayout = lazy(() => import('../layout/student/StudentLayout'))
const HomePage = lazy(() => import('../pages/home/HomePage'))
const StudentDashboard = lazy(() => import('../layout/student/dashboard/StudentDashboard'))
const CourseDetails = lazy(() => import('../components/generic/courses/CourseDetails'))
const LessonDetails = lazy(() => import('../components/generic/lessons/LessonDetails'))
const SessionDetails = lazy(() => import('../components/generic/sessions/SessionDetails'))
const studentRoutes: RouteObject[] = [
  {
    path: '/',
    element: <StudentLayout />,
    children: [
      { index: true, element: <HomePage /> },
      { path: '/course/:id', element: <CourseDetails /> },
      { path: '/course/:courseId', element: <CourseDetails /> },
      { path: '/course/:courseId/session/:sessionId', element: <SessionDetails /> },
      { path: '/course/:courseId/session/:sessionId/lesson/:lessonId', element: <LessonDetails /> }
    ],
  },
  {
    path: '/dashboard-student',
    element: <StudentDashboard />,
    children: [
      {index: true, element: <DashboardStudent/>},
      {path: "student-profile", element: <StudentProfile/>},
      {path: "student-orders", element: <StudentOrders/>},
      {path: "student-subcription", element: <StudentSubcription/>}
    ],
  },
]

export default studentRoutes