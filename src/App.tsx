import { createBrowserRouter, RouterProvider } from 'react-router-dom'
import { lazy, Suspense } from 'react'
import Loading from './components/generic/Loading'
const StudentLayout = lazy(() => import('./layout/student/StudentLayout'))
const HomePage = lazy(() => import('./pages/home/HomePage'))
const LoginPage = lazy(() => import('./pages/LoginPage/LoginPage'))
const RegisterPage = lazy(() => import('./pages/RegisterPage/RegisterPage'))
const AdminLayout = lazy(() => import('./layout/admin/AdminLayout'))
const Dashboard = lazy(() => import('./components/admin/DashBoard'))

const App = () => {
  const router = createBrowserRouter([
    {
      path: '/login',
      element: <LoginPage />,
    },
    {
      path: '/register',
      element: <RegisterPage />,
    },
    {
      path: '/',
      element: <StudentLayout />,
      children: [
        { index: true, element: <HomePage /> },
      ],
    },
    {
      path: '/admin',
      element: <AdminLayout />,
      children: [
        { path: 'dashboard', element: <Dashboard /> },
      ],
    },
  ])

  return (
    <Suspense fallback={<Loading />}>
      <RouterProvider router={router} />
    </Suspense>
  )
}

export default App
