import { lazy } from 'react'
import { RouteObject } from 'react-router-dom'
const StudentLayout = lazy(() => import('../layout/student/StudentLayout'))
const HomePage = lazy(() => import('../pages/home/HomePage'))

const studentRoutes: RouteObject[] = [
  {
    path: '/',
    element: <StudentLayout />,
    children: [
      { index: true, element: <HomePage /> },
    ],
  },
]

export default studentRoutes