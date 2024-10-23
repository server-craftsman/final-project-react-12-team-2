import { createBrowserRouter, RouterProvider } from "react-router-dom";
import ScrollToTopButton from "./components/generic/home/ScrollToTopButton";
import Loading from "./app/Loading";
import { Suspense } from "react";
import { useSelector } from "react-redux";
// Import Routes
import useProtectedRoutes from "./routes/protected/useProtectedRoutes";
import publishRoutes from "./routes/publish/publishRoutes";

// import adminRoutes from "./routes/subs/adminRoutes";
// import instructorRoutes from "./routes/subs/instructorRoutes";
// import studentRoutes from "./routes/subs/studentRoutes";
//==============================

export const App = () => {
  const protectedRoutes = useProtectedRoutes();
  const router = createBrowserRouter([
    ...protectedRoutes,
    ...publishRoutes,
  ]);

  const isLoading = useSelector((state: any) => state.loading);
  return (
    <>
      <Suspense fallback={isLoading ? <Loading /> : null}>
        <RouterProvider key={router.routes.length} router={router} />
      </Suspense>
      <ScrollToTopButton />
    </>
  );
};