import adminRoutes from "../subs/adminRoutes";
import instructorRoutes from "../subs/instructorRoutes";
import studentRoutes from "../subs/studentRoutes";
import { wrapRoutesWithProtection } from "./wrapRoutesWithProtection";

// Wrap each set of routes with the appropriate roles
const adminProtectedRoutes = wrapRoutesWithProtection(adminRoutes, ["ADMIN"]);
const instructorProtectedRoutes = wrapRoutesWithProtection(instructorRoutes, [
  "INSTRUCTOR",
]);
const studentProtectedRoutes = wrapRoutesWithProtection(studentRoutes, [
  "STUDENT",
]);

// Export the protected routes
export {
  adminProtectedRoutes,
  instructorProtectedRoutes,
  studentProtectedRoutes,
};
