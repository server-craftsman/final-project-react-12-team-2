import { createBrowserRouter, RouterProvider } from "react-router-dom";
import { Suspense } from "react";
import ScrollToTopButton from "./components/generic/home/ScrollToTopButton";
// import { AuthProvider } from "./context/AuthContext";

// Import Routes
import useProtectedRoutes from "./routes/protected/useProtectedRoutes";
import publishRoutes from "./routes/publish/publishRoutes";

// import adminRoutes from "./routes/subs/adminRoutes";
// import instructorRoutes from "./routes/subs/instructorRoutes";
// import studentRoutes from "./routes/subs/studentRoutes";
//==============================

const App = () => {
  const protectedRoutes = useProtectedRoutes();

  const router = createBrowserRouter([
    ...protectedRoutes,
    ...publishRoutes,
  ]);

  return (
    <>
      <Suspense>
        <RouterProvider key={router.routes.length} router={router} />
      </Suspense>
      <ScrollToTopButton />
    </>
  );
};

export default App;
