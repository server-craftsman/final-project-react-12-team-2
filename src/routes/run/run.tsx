import { RouteObject } from "react-router-dom";
import { lazy, useEffect, useState } from "react";
// Import router path
import { ROUTER_URL } from "../../const/router.path";
import { UserRole } from "../../models/User";

// Import guard routes
import GuardProtectedRoute from "../protected/GuardProtectedRoute";
import GuardPublicRoute from "../publish/GuardPublicRoute";

// Import layout
const MainLayout = lazy(() => import("../../layout/main-layout/MainLayout"));
const AdminLayout = lazy(() => import("../../layout/admin/AdminLayout"));
const InstructorLayout = lazy(() => import("../../layout/instructor/InstructorLayout"));
const StudentLayout = lazy(() => import("../../layout/student/StudentDashboard"));

// Import sub paths
import { adminSubPaths } from "../sub-paths/adminSubPaths";
import { publicSubPaths } from "../publish/publicSubPaths";
import { instructorSubPaths } from "../sub-paths/instructorSubPaths";
import { studentSubPaths } from "../sub-paths/studentSubPaths";

function RunRoutes() {
    const [role, setRole] = useState<UserRole | null>(null);

    useEffect(() => {
        const storedRole = localStorage.getItem("role");
        console.log("storedRole", storedRole); // Kiểm tra giá trị storedRole
        if (storedRole) {
            setRole(storedRole as UserRole);
            console.log("Role set to:", storedRole); // Kiểm tra sau khi setRole
        }
    }, []);
    
    const runProtectedRoutes: RouteObject[] = [
      {
          path: ROUTER_URL.COMMON.HOME,
          element: <GuardPublicRoute path={ROUTER_URL.COMMON.HOME} component={<MainLayout />} />,
          children: publicSubPaths[ROUTER_URL.COMMON.HOME]
      },
      {
          path: ROUTER_URL.ADMIN.BASE,
          element: (
              <GuardProtectedRoute
                  path={ROUTER_URL.ADMIN.BASE}
                  component={<AdminLayout />}
                  userRole={role as UserRole} // Pass the role state here
                  allowedRoles={["admin"]}
              />
          ),
          children: adminSubPaths[ROUTER_URL.ADMIN.BASE]
      },
      {
          path: ROUTER_URL.INSTRUCTOR.BASE,
          element: (
              <GuardProtectedRoute
                  path={ROUTER_URL.INSTRUCTOR.BASE}
                  component={<InstructorLayout />}
                  userRole={role as UserRole} // Pass the role state here
                  allowedRoles={["instructor"]}
              />
          ),
          children: instructorSubPaths[ROUTER_URL.INSTRUCTOR.BASE]
      },
      {
          path: ROUTER_URL.STUDENT.BASE,
          element: (
              <GuardProtectedRoute
                  path={ROUTER_URL.STUDENT.BASE}
                  component={<StudentLayout />}
                  userRole={role as UserRole} // Pass the role state here
                  allowedRoles={["student"]}
              />
          ),
          children: studentSubPaths[ROUTER_URL.STUDENT.BASE]
      }
  ];

  return runProtectedRoutes;
}

export default RunRoutes;
