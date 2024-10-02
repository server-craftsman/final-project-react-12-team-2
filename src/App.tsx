import { createBrowserRouter, RouterProvider } from 'react-router-dom'
import StudentLayout from './layout/student/StudentLayout'
import HomePage from './pages/home/HomePage'
const App = () => {

  const router = createBrowserRouter([
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
