import { lazy } from 'react'
import { RouteObject } from 'react-router-dom'

//import lazy
const MainLayout = lazy(() => import('../layout/main-layout/MainLayout'))
const HomePage = lazy(() => import('../pages/home/HomePage'))
const CourseDetails = lazy(() => import('../components/generic/courses/main-display/CourseDetails'))
const LessonDetails = lazy(() => import('../components/generic/lessons/LessonDetails'))
const SessionDetails = lazy(() => import('../components/generic/sessions/SessionDetails'))
const CartPage = lazy(() => import('../components/generic/cart/CartPage'))
//==============================================================

const commonRoutes: RouteObject[] = [
  {
    path: '/',
    element: <MainLayout />,
    children: [
      { index: true, element: <HomePage /> },
      { path: '/course/:id', element: <CourseDetails /> },
      { path: '/course/:courseId', element: <CourseDetails /> },
      { path: '/course/:courseId/session/:sessionId', element: <SessionDetails /> },
      { path: '/course/:courseId/lesson/:lessonId', element: <LessonDetails /> },
      {path: "cart", element: <CartPage/>}
    ],
  }
]
export default commonRoutes