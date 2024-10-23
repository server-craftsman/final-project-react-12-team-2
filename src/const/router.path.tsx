// import { RouteObject } from "react-router-dom";
// import useProtectedRoutes from "../routes/protected/protectedRoutes";
// import publishRoutes from "../routes/publish/publishRoutes";

// // Combine all routes
// export const ROUTER_OBJECT: RouteObject[] = [
//   ...useProtectedRoutes(),
//   ...publishRoutes,
// ];

export const ROUTER_URL = {
  LOGIN: "/login",
  REGISTER: "/register",
  ADMIN: {
    BASE: "/admin",
    INFO: "/admin/admin-info",
    MANAGE_USER: "/admin/manage-user",
    VIEW_USER: "/admin/view-user/:id",
    EDIT_USER: "/admin/edit-user/:id",
    PAYOUT: "/admin/payout",
    PURCHASE: "/admin/purchase",
    VIEW_PURCHASE: "/admin/view-purchase/:id",
    CATEGORIES: "/admin/categories",
    EDIT_CATEGORY: "/admin/edit-category/:id",
    COURSES: "/admin/courses",
    PURCHASES_LOG: "/admin/purchases-log",
    CATEGORIES_DETAILS: "/admin/categories/details-category",
    CATEGORIES_DETAILS_ID: "/admin/categories/categories-details/:id",
    COURSES_LOG: "/admin/courses-log",
    SUBSCRIPTION: "/admin/subscription",
    REQUEST_ACCOUNT: "/admin/request-account",
  },
  INSTRUCTOR: {
    BASE: "/instructor",
    SETTING: "/instructor/setting",
    EDIT_USER: "/instructor/edit-user/:id",
    INFO: "/instructor/instructor-info",
    REVIEWS: "/instructor/reviews",
    PURCHASES: "/instructor/purchases",
    PAYOUT: "/instructor/payout",
    VIEW_TRANSACTIONS: "/instructor/payout/view-transactions/:id",
    ORDERS: "/instructor/orders",
    COURSES: "/instructor/courses",
    SUBSCRIPTION: "/instructor/subscription",
  },
  STUDENT: {
    BASE: "/dashboard-student",
    SETTING: "/dashboard-student/student-setting",
    ORDERS: "/dashboard-student/student-orders",
    SUBSCRIPTION: "/dashboard-student/student-subscription",
    EDIT_USER: "/dashboard-student/student/edit-user/:id",
  },
  COMMON: {
    HOME: "/",
    COURSE_DETAILS: "/course-details",
    COURSE_BY_ID: "/course/:id",
    SESSION_DETAILS: "/session-details",
    LESSON_DETAILS: "/lesson-details",
    CART: "/cart",
    ABOUT: "/about",
  },
};