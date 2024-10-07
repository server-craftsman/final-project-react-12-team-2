import { createBrowserRouter, RouterProvider } from 'react-router-dom'
import { lazy, Suspense, useState, useEffect } from 'react'
import Loading from './components/generic/Loading'
import { Button } from 'antd'
import { UpOutlined } from '@ant-design/icons'
import Profile from './pages/admin/Profile'
const StudentLayout = lazy(() => import('./layout/student/StudentLayout'))
const HomePage = lazy(() => import('./pages/home/HomePage'))
const LoginPage = lazy(() => import('./pages/LoginPage/LoginPage'))
const RegisterPage = lazy(() => import('./pages/RegisterPage/RegisterPage'))
const AdminLayout = lazy(() => import('./layout/admin/AdminLayout'))
const Dashboard = lazy(() => import('./components/admin/DashBoard'))

const App = () => {
  const [isVisible, setIsVisible] = useState(false)

  const toggleVisibility = () => {
    if (window.scrollY > 10) {
      setIsVisible(true)
    } else {
      setIsVisible(false)
    }
  }

  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: 'smooth'
    })
  }

  useEffect(() => {
    window.addEventListener('scroll', toggleVisibility)
    return () => window.removeEventListener('scroll', toggleVisibility)
  }, [])

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
        { index: true, element: <Dashboard /> },
        {path: 'admininfo', element: <Profile /> },
      ],
    },
  ])

  return (
    <>
      <Suspense fallback={<Loading />}>
        <RouterProvider router={router} />
      </Suspense>
      {isVisible && (
        <Button
          type="primary"
          shape="circle"
          icon={<UpOutlined />}
          size="large"
          onClick={scrollToTop}
          style={{
            position: 'fixed',
            bottom: '20px',
            right: '20px',
            zIndex: 1000,
            backgroundColor: '#857aff',
            color: 'white',
            border: 'none',
          }}
        />
      )}
    </>
  )
}

export default App
