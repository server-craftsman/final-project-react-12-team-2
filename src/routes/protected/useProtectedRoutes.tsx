import { useEffect, useState } from "react";
import { RouteObject, Navigate } from "react-router-dom";
// import { useContext } from "react";
// import { AuthContext } from "../../context/AuthContext";
import ProtectedRoute from "./ProtectedRoute";
import adminRoutes from "../subs/adminRoutes";
import instructorRoutes from "../subs/instructorRoutes";
import studentRoutes from "../subs/studentRoutes";
// import DashBoardAdmin from "../../pages/admin/overview/DashBoard Admin";
import { UserRole } from "../../models/User";

const findIndexRoute = (routes: RouteObject[]) => {
  return routes.find(route => route.path === "index");
};

const DefaultComponent = () => <div>Default Component</div>;

const useProtectedRoutes = (): RouteObject[] => {
  const [role, setRole] = useState<UserRole | null>(null);

  useEffect(() => {
    const storedRole = localStorage.getItem("userRole");
    console.log("storedRole", storedRole);
    if (storedRole) {
      setRole(storedRole as UserRole);
    }
  }, []);

  let roleBasedRoutes: RouteObject[] = [];

  switch (role) {
    case UserRole.admin:
      roleBasedRoutes = adminRoutes.map((route) => ({
        ...route,
        element: (
          <ProtectedRoute
            component={route.children ? (findIndexRoute(route.children)?.element as unknown as React.ComponentType<any>) || DefaultComponent : DefaultComponent}
            userRole={role as UserRole}
            allowedRoles={[UserRole.admin]}
          />
        ),
      }));
      break;
    case UserRole.instructor:
      roleBasedRoutes = instructorRoutes.map((route) => ({
        ...route,
        element: (
          <ProtectedRoute
            component={route.children ? (findIndexRoute(route.children)?.element as unknown as React.ComponentType<any>) || DefaultComponent : DefaultComponent}
            userRole={role as UserRole}
            allowedRoles={[UserRole.instructor]}
          />
        ),
      }));
      break;
    case UserRole.student:
      roleBasedRoutes = studentRoutes.map((route) => ({
        ...route,
        element: (
          <ProtectedRoute
            component={route.children ? (findIndexRoute(route.children)?.element as unknown as React.ComponentType<any>) || DefaultComponent : DefaultComponent}
            userRole={role as UserRole}
            allowedRoles={[UserRole.student]}
          />
        ),
      }));
      break;
    default:
      roleBasedRoutes = [
        {
          path: "*",
          element: <Navigate to="/" />,
        },
      ];
      console.log("roleBasedRoutes", roleBasedRoutes);
  }

  return [...roleBasedRoutes];
};

export default useProtectedRoutes;
