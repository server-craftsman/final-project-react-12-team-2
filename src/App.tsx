import { createBrowserRouter, RouterProvider } from 'react-router-dom'
import StudentLayout from './layout/student/StudentLayout'
import HomePage from './pages/home/HomePage'
import LoginPage from './pages/LoginPage/LoginPage'
import RegisterPage from './pages/RegisterPage/RegisterPage'
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
    <RouterProvider router={router} />
  )
}

export default App
