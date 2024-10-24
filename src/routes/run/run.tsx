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
  const { role, setRole } = useAuth();

  useEffect(() => {
    const storedRole = localStorage.getItem("role");
    if (storedRole) {
      setRole(storedRole as UserRole);
    }
  }, [setRole]); // Thêm setRole vào dependency array

  const renderProtectedRoutes = () => {
    if (!role) return null;

    const handleAccessDenied = () => {
      console.log('Access denied for role:', role);
    };

    return (
      <>
        <Route
          path={ROUTER_URL.ADMIN_PATH}
          element={
            <GuardProtectedRoute
              component={<AdminLayout />}
              userRole={role}
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
              userRole={role}
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
              userRole={role}
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
