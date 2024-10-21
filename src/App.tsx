import { createBrowserRouter, RouterProvider } from "react-router-dom";
import { Suspense } from "react";
import Loading from "./components/generic/home/Loading";
import ScrollToTopButton from "./components/generic/home/ScrollToTopButton";
import { AuthProvider } from "./context/AuthContext"; // Import AuthProvider

// Import Routes
// import useProtectedRoutes from "./routes/protected/protectedRoutes";
import publishRoutes from "./routes/publish/publishRoutes";

import adminRoutes from "./routes/subs/adminRoutes";
import instructorRoutes from "./routes/subs/instructorRoutes";
import studentRoutes from "./routes/subs/studentRoutes";
import { CartProvider } from "./context/CartContext";
//==============================

const App = () => {
  // const protectedRoutes = useProtectedRoutes();
  const router = createBrowserRouter([
    ...adminRoutes,
    ...instructorRoutes,
    ...studentRoutes,
    // ...protectedRoutes,
    ...publishRoutes,
  ]);

  return (
    <>
      <Suspense fallback={<Loading />}>
        <AuthProvider>
          <CartProvider>
            <RouterProvider router={router} />
          </CartProvider>
        </AuthProvider>
      </Suspense>
      <ScrollToTopButton />
    </>
  );
};

export default App;
