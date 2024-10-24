import { Route, Routes } from "react-router-dom";
import { lazy, useEffect, useState, Suspense } from "react";
// Import router path
import { ROUTER_URL } from "../../const/router.path";
import { UserRole } from "../../models/User";

// Import guard routes
import GuardProtectedRoute from "../protected/GuardProtectedRoute";
import GuardPublicRoute from "../publish/GuardPublicRoute";

// Import layout
import MainLayout from "../../layout/main-layout/MainLayout";
const AdminLayout = lazy(() => import("../../layout/admin/AdminLayout"));
const InstructorLayout = lazy(() => import("../../layout/instructor/InstructorLayout"));
const StudentLayout = lazy(() => import("../../layout/student/StudentDashboard"));

// Import sub paths
import { adminSubPaths } from "../sub-paths/adminSubPaths";
import { publicSubPaths } from "../publish/publicSubPaths";
import { instructorSubPaths } from "../sub-paths/instructorSubPaths";
import { studentSubPaths } from "../sub-paths/studentSubPaths";

const RunRoutes = (): JSX.Element => {
  const [role, setRole] = useState<UserRole | null>(null);

  useEffect(() => {
    const storedRole = localStorage.getItem("role");
    if (storedRole) {
      setRole(storedRole as UserRole);
    }
  }, []);

  const renderProtectedRoutes = () => {
    if (!role) return null;

    return (
      <>
        <Route
          path={ROUTER_URL.ADMIN.BASE}
          element={
            <GuardProtectedRoute
              component={<AdminLayout />}
              userRole={role}
              allowedRoles={["admin"]}
            />
          }
        >
          {adminSubPaths[ROUTER_URL.ADMIN.BASE]?.map((route) => (
            <Route
              key={route.path || 'index'}
              index={route.index}
              path={!route.index ? route.path : undefined}
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
    <Suspense fallback={<div>Loading...</div>}>
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
    </Suspense>
  );
};

export default RunRoutes;
