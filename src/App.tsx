import {
  createBrowserRouter,
  RouteObject,
  RouterProvider,
} from "react-router-dom";
import { Suspense } from "react";
import Loading from "./components/generic/home/Loading";
import ScrollToTopButton from "./components/generic/home/ScrollToTopButton";
import { UserRole } from "./models/User";
import { AuthProvider } from "./context/AuthContext";

// Import Routes
import {
  adminProtectedRoutes,
  instructorProtectedRoutes,
  studentProtectedRoutes,
} from "./routes/protected/protectedRoutes";
import publishRoutes from "./routes/publish/publishRoutes";
import { CartProvider } from "./context/CartContext";

// Utility function to get role-based routes
const getRoleBasedRoutes = (userRole: UserRole): RouteObject[] => {
  switch (userRole) {
    case UserRole.ADMIN:
      return adminProtectedRoutes;
    case UserRole.INSTRUCTOR:
      return instructorProtectedRoutes;
    case UserRole.STUDENT:
      return studentProtectedRoutes;
    default:
      return [];
  }
};

const App = () => {
  const userRole: UserRole = UserRole.STUDENT;
  const roleBasedRoutes = getRoleBasedRoutes(userRole);
  const router = createBrowserRouter([...roleBasedRoutes, ...publishRoutes]);

  return (
    <AuthProvider>
      <Suspense fallback={<Loading />}>
        <CartProvider>
          <RouterProvider router={router} />
        </CartProvider>
      </Suspense>
      <ScrollToTopButton />
    </AuthProvider>
  );
};

export default App;
