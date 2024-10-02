import { createBrowserRouter, RouterProvider } from 'react-router-dom'
import { lazy, Suspense } from 'react'

const StudentLayout = lazy(() => import('./layout/student/StudentLayout'))
const HomePage = lazy(() => import('./pages/home/HomePage'))
const LoginPage = lazy(() => import('./pages/LoginPage/LoginPage'))
const RegisterPage = lazy(() => import('./pages/RegisterPage/RegisterPage'))
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
  ])
  return (
    <Suspense fallback={
      <div className="flex items-center justify-center h-screen bg-gradient-to-r from-purple-600 to-indigo-600">
        <div className="text-center">
          <div className="animate-spin rounded-full h-32 w-32 border-t-2 border-b-2 border-white mx-auto mb-4"></div>
          <h2 className="text-3xl font-serif text-white">Loading...</h2>
          <p className="text-lg text-gray-300 mt-2">Please wait while we prepare your luxurious experience</p>
        </div>
      </div>
    }>
      <RouterProvider router={router} />
    </Suspense>
  )
}

export default App
