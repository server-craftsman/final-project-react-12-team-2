import { Route, Routes } from "react-router-dom";
import { lazy, useEffect } from "react";

//import context
import { useAuth } from "../../contexts/AuthContext";

// Import router path
import { ROUTER_URL } from "../../const/router.path";
import { UserRole } from "../../models/User";

// Import guard routes
import GuardProtectedRoute from "../protected/GuardProtectedRoute";
import GuardPublicRoute from "../publish/GuardPublicRoute";

// Import layout
const AdminLayout = lazy(() => import("../../layout/admin/AdminLayout"));
const InstructorLayout = lazy(() => import("../../layout/instructor/InstructorLayout"));
const StudentLayout = lazy(() => import("../../layout/student/StudentDashboard"));

// Import sub paths
import { adminSubPaths } from "../sub-paths/adminSubPaths";
import { publicSubPaths } from "../publish/publicSubPaths";
import { instructorSubPaths } from "../sub-paths/instructorSubPaths";
import { studentSubPaths } from "../sub-paths/studentSubPaths";

const RunRoutes = (): JSX.Element => {
  const { role } = useAuth();

  // Add debugging logs
  useEffect(() => {
    console.log('Current role from context:', role);
    console.log('Current role from localStorage:', localStorage.getItem("role"));
  }, [role]);

  const renderProtectedRoutes = () => {
    const currentRole = role || localStorage.getItem("role") as UserRole;
    console.log('Rendering protected routes with role:', currentRole);

    if (!currentRole) {
      console.log('No role found, protected routes will not render');
      return null;
    }

    const handleAccessDenied = () => {
      console.error('Access denied for role:', currentRole);
      // You could add additional handling here, like redirecting to an error page
    };

    return (
      <>
        <Route
          path={ROUTER_URL.ADMIN_PATH}
          element={
            <GuardProtectedRoute
              component={<AdminLayout />}
              userRole={currentRole}
              allowedRoles={["admin"]}
              onAccessDenied={handleAccessDenied}
            />
          }
        >
          {adminSubPaths[ROUTER_URL.ADMIN_PATH]?.map((route) => (
            <Route
              key={route.path || 'index'}
              index={route.index} //loading index
              path={route.path?.replace('/admin/', '')}  // Remove /admin/ prefix
              element={route.element}
            />
          ))}
        </Route>

        <Route
          path={ROUTER_URL.INSTRUCTOR.BASE}
          element={
            <GuardProtectedRoute
              component={<InstructorLayout />}
              userRole={currentRole}
              allowedRoles={["instructor"]}
              onAccessDenied={handleAccessDenied}
            />
          }
        >
          {instructorSubPaths[ROUTER_URL.INSTRUCTOR.BASE]?.map((route) => (
            <Route
              key={route.path || 'index'}
              index={route.index}
              path={!route.index ? route.path : undefined}
              element={route.element}
            />
          ))}
        </Route>

        <Route
          path={ROUTER_URL.STUDENT.BASE}
          element={
            <GuardProtectedRoute
              component={<StudentLayout />}
              userRole={currentRole}
              allowedRoles={["student"]}
              onAccessDenied={handleAccessDenied}
            />
          }
        >
          {studentSubPaths[ROUTER_URL.STUDENT.BASE]?.map((route) => (
            <Route
              key={route.path || 'index'}
              index={route.index}
              path={!route.index ? route.path : undefined}
              element={route.element}
            />
          ))}
        </Route>
      </>
    );
  };

  return (
      <Routes>
        {/* Public Routes */}
        {Object.entries(publicSubPaths).map(([key, routes]) =>
          routes.map((route) => (
            <Route
              key={route.path || 'index'}
              path={route.path}
              element={
                key === ROUTER_URL.COMMON.HOME ? (
                  <GuardPublicRoute component={route.element} />
                ) : (
                  route.element
                )
              }
            >
              {route.children?.map((childRoute) => (
                <Route
                  key={childRoute.path}
                  path={childRoute.path}
                  element={childRoute.element}
                />
              ))}
            </Route>
          ))
        )}

        {/* Protected Routes */}
        {renderProtectedRoutes()}
      </Routes>
  );
};

export default RunRoutes;
