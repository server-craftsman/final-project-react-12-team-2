import { lazy } from 'react'
import { RouteObject } from 'react-router-dom'
import DashboardStudent from '../pages/student/DashboardStudent'
import StudentProfile from '../components/student/profile/StudentProfile'
import StudentSubcription from '../components/student/profile/StudentSubcription'
import StudentOrders from '../components/student/profile/StudentOrders'
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
      {index: true, element: <DashboardStudent/>},
      {path: "student-profile", element: <StudentProfile/>},
      {path: "student-orders", element: <StudentOrders/>},
      {path: "student-subcription", element: <StudentSubcription/>},
     
    ],
  },
]

export default studentRoutes