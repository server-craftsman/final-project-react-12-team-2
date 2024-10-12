import { createBrowserRouter, RouterProvider } from 'react-router-dom'
import { Suspense } from 'react'
import Loading from './components/generic/home/Loading'
import ScrollToTopButton from './components/generic/home/ScrollToTopButton'

//Import Routes
import protectedRoutes from './routes/protected/protectedRoutes'
import publishRoutes from './routes/publish/publishRoutes'
import { CartProvider } from './context/CartContext';
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
