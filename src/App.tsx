import { createBrowserRouter, RouterProvider } from 'react-router-dom'
import { Suspense } from 'react'
import Loading from './components/generic/home/Loading'
import ScrollToTopButton from './components/generic/home/ScrollToTopButton'

//Import Routes
// import authRoutes from './routes/authRoutes'
// import studentRoutes from './routes/studentRoutes'
// import adminRoutes from './routes/adminRoutes'
// import instructorRoutes from './routes/instructorRoutes'
// import commonRoutes from './routes/commonRoutes'
import protectedRoutes from './routes/protected/protectedRoutes'
import publishRoutes from './routes/publish/publishRoutes'
import { CartProvider } from './context/CartContext'; // Add this import
//==============================

const App = () => {
  const router = createBrowserRouter([
    ...protectedRoutes,
    ...publishRoutes,
  ])

  return (
    <>
      <Suspense fallback={<Loading />}>
        <CartProvider>
          <RouterProvider router={router} />
        </CartProvider>
      </Suspense>
      <ScrollToTopButton />
    </>
  )
}

export default App
