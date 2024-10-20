import { createBrowserRouter, RouterProvider } from "react-router-dom";
import { Suspense } from "react";
import Loading from "./components/generic/home/Loading";
import ScrollToTopButton from "./components/generic/home/ScrollToTopButton";
import { AuthProvider } from "./context/AuthContext"; // Import AuthProvider

// Import Routes
import useProtectedRoutes from "./routes/protected/protectedRoutes";
import publishRoutes from "./routes/publish/publishRoutes";
import { CartProvider } from "./context/CartContext";
//==============================

const App = () => {
  const protectedRoutes = useProtectedRoutes();
  const router = createBrowserRouter([...protectedRoutes, ...publishRoutes]);

  return (
    <>
      <Suspense fallback={<Loading />}>
        <AuthProvider>
          {" "}
          {/* Wrap with AuthProvider */}
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
