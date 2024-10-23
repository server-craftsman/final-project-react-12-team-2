import { createBrowserRouter, RouterProvider } from "react-router-dom";
import ScrollToTopButton from "./components/generic/home/ScrollToTopButton";
import { Suspense } from "react";
import Loading from "./app/Loading";
import { useSelector } from "react-redux";
// Import Routes
import useProtectedRoutes from "./routes/protected/useProtectedRoutes";
// Import runProtectedRoutes
import runProtectedRoutes from "./routes/run/run";
//==============================

export const App = () => {
  const isLoading = useSelector((state: any) => state.loading);
  const protectedRoutes = useProtectedRoutes();
  console.log("Protected Routes:", protectedRoutes);

  const router = createBrowserRouter([
    // Ensure your route objects are correctly structured
    // ...protectedRoutes,
    ...runProtectedRoutes()
  ]);
  console.log("Router Config:", router);

  return (
    <>
      <Suspense fallback={isLoading ? <Loading /> : null}>
        <RouterProvider router={router} />
      </Suspense>
      <ScrollToTopButton />
    </>
  );
};
