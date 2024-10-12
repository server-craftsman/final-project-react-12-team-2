import { lazy } from 'react'
import { RouteObject } from 'react-router-dom'

//import lazy
const DashboardStudent = lazy(() => import('../pages/student/overview/DashboardStudent'))
const StudentProfile = lazy(() => import('../pages/student/setting/ProfileManagement'))
const SubscriptionManagement = lazy(() => import('../pages/student/setting/SubscriptionManagement'))
const OrderManagement = lazy(() => import('../pages/student/setting/OrderManagement'))
const StudentLayout = lazy(() => import('../layout/main-layout/MainLayout'))
const HomePage = lazy(() => import('../pages/home/HomePage'))
const StudentDashboard = lazy(() => import('../layout/student/StudentDashboard'))
const CourseDetails = lazy(() => import('../components/generic/courses/main-display/CourseDetails'))
const LessonDetails = lazy(() => import('../components/generic/lessons/LessonDetails'))
const SessionDetails = lazy(() => import('../components/generic/sessions/SessionDetails'))
const CartPage = lazy(() => import('../components/generic/cart/CartPage'))
//==============================================================

const studentRoutes: RouteObject[] = [
  {
    path: '/',
    element: <StudentLayout />,
    children: [
      { index: true, element: <HomePage /> },
      { path: '/course/:id', element: <CourseDetails /> },
      { path: '/course/:courseId', element: <CourseDetails /> },
      { path: '/course/:courseId/session/:sessionId', element: <SessionDetails /> },
      { path: '/course/:courseId/lesson/:lessonId', element: <LessonDetails /> },
      {path: "cart", element: <CartPage/>}
    ],
  },
  {
    path: '/dashboard-student',
    element: <StudentDashboard />,
    children: [
      {index: true, element: <DashboardStudent/>},
      {path: "student-setting", element: <StudentProfile/>},
      {path: "student-orders", element: <OrderManagement/>},
      {path: "student-subscription", element: <SubscriptionManagement/>},
    ],
  }
]

export default studentRoutes