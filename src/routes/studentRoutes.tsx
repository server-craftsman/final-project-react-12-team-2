import { lazy } from 'react'
import { RouteObject } from 'react-router-dom'
const StudentLayout = lazy(() => import('../layout/student/StudentLayout'))
const HomePage = lazy(() => import('../pages/home/HomePage'))
const StudentDashboard = lazy(() => import('../layout/student/dashboard/StudentDashboard'))
const studentRoutes: RouteObject[] = [
  {
    path: '/',
    element: <StudentLayout />,
    children: [
      { index: true, element: <HomePage /> },
    ],
  },
  {
    path: '/dashboard-student',
    element: <StudentDashboard />,
    children: [
      { index: true, element: <HomePage /> },
    ],
  },
]

export default studentRoutes