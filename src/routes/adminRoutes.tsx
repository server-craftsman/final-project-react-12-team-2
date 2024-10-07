import { lazy } from 'react'
import { RouteObject } from 'react-router-dom'
const Profile = lazy(() => import('../pages/admin/Profile'))
const ManageUser = lazy(() => import('../pages/admin/ManageUser'))
const Dashboard = lazy(() => import('../components/admin/DashBoard'))
const AdminLayout = lazy(() => import('../layout/admin/AdminLayout'))

const adminRoutes: RouteObject[] = [
  {
    path: '/admin',
    element: <AdminLayout />,
    children: [
      { index: true, element: <Dashboard /> },
      { path: 'admin-info', element: <Profile /> },
      { path: 'manage-user', element: <ManageUser /> },
    ],
  },
]

export default adminRoutes