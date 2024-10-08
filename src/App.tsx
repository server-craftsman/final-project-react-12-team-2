import { createBrowserRouter, RouterProvider } from 'react-router-dom'
import { Suspense } from 'react'
import Loading from './components/generic/Loading'
import ScrollToTopButton from './components/generic/ScrollToTopButton'

//Import Routes
import authRoutes from './routes/authRoutes'
import studentRoutes from './routes/studentRoutes'
import adminRoutes from './routes/adminRoutes'
import instructorRoutes from './routes/instructorRoutes'
//==============================

const App = () => {
  const router = createBrowserRouter([
    ...authRoutes,
    ...studentRoutes,
    ...adminRoutes,
    ...instructorRoutes,
  ])

  return (
    <>
      <Suspense fallback={<Loading />}>
        <RouterProvider router={router} />
      </Suspense>
      <ScrollToTopButton />
    </>
  )
}

export default App
