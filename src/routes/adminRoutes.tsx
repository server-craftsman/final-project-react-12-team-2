import { lazy } from 'react'
import { RouteObject } from 'react-router-dom'
const ViewUserProfileDetail = lazy(() => import('../components/admin/ViewUserProfileDetail'))
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
      { path: 'view-user/:id', element: <ViewUserProfileDetail /> },
    ],
  },
]

export default adminRoutes