export const API = {
  BANK: {
    GET_BANK: "https://api.vietqr.io/v2/banks"
  },
  AUTH: {
    LOGIN: "api/auth",
    LOGOUT: "api/auth/logout",
    LOGIN_GOOGLE: "api/auth/google",
    REGISTER_GOOGLE_PUBLIC: "api/users/google",
    REGISTER: "api/users",
    VERIFY_TOKEN: "api/auth/verify-token",
    RESEND_TOKEN: "api/auth/resend-token",
    FORGOT_PASSWORD: "api/auth/forgot-password"
  },
  ADMIN: {
    GET_USERS: "api/users/search",
    GET_USER_DETAILS: "api/users/:id",
    UPDATE_USER: "api/users/:id",
    CHANGE_STATUS: "api/users/change-status",
    CHANGE_ROLE: "api/users/change-role",
    CHANGE_PASSWORD: "api/users/change-password",
    CREATE_USER: "api/users/create",
    DELETE_USER: "api/users/:id",
    REVIEW_PROFILE_INSTRUCTOR: "api/users/review-profile-instructor",
    GET_CATEGORY: "api/category/search",
    CREATE_CATEGORY: "api/category",
    DELETE_CATEGORY: "api/category/:id",
    UPDATE_CATEGORY: "api/category/:id",
    GET_CATEGORY_DETAILS: "api/category/:id",
    GET_BLOG_DETAILS: "api/blog/:id",
    UPDATE_BLOG: "api/blog/:id",
    GET_BLOG: "api/blog/search",
    CREATE_BLOG: "api/blog",
    DELETE_BLOG: "api/blog/:id"
  },
  INSTRUCTOR: {
    GET_USER_DETAILS: "api/users/:id",
    UPDATE_USER: "api/users/:id",
    CHANGE_PASSWORD: "api/users/change-password"
  },
  STUDENT: {
    GET_USER_DETAILS: "api/users/:id",
    UPDATE_USER: "api/users/:id",
    CHANGE_PASSWORD: "api/users/change-password"
  },
  CATEGORY: {
    GET_PUBLIC_CATEGORY: "api/client/category/search"
  },
  CART: {
    CREATE_CART: "api/cart",
    GET_CART_ITEMS: "api/cart/search",
    UPDATE_CART_STATUS: "api/cart/update-status",
    DELETE_CART: "api/cart/:id"
  },
  COURSE: {
    //instructor
    GET_COURSE: "api/course/search",
    CREATE_COURSE: "api/course",
    CHANGE_STATUS_COURSE: "api/course/change-status",
    UPDATE_COURSE: "api/course/:id",
    GET_COURSE_BY_ID: "api/course/:id",
    DELETE_COURSE: "api/course/:id",
    //=========================================
    //public
    GET_PUBLIC_COURSE: "api/client/course/search",
    GET_PUBLIC_COURSE_DETAIL: "api/client/course/:id"
    //=========================================
  },
  SESSION: {
    GET_SESSION: "api/session/search",
    GET_SESSION_DETAIL: "api/session/:id",
    CREATE_SESSION: "api/session",
    UPDATE_SESSION: "api/session/:id",
    DELETE_SESSION: "api/session/:id"
  },
  LESSON: {
    GET_LESSON: "api/lesson/search",
    GET_LESSON_DETAILS: "api/lesson/:id",
    CREATE_LESSON: "api/lesson",
    UPDATE_LESSON: "api/lesson/:id",
    DELETE_LESSON: "api/lesson/:id"
  },
  SUBSCRIPTION: {
    //instructor
    GET_SUBSCRIPTIONS: "api/subscription/search-for-subscriber",
    GET_SUBSCRIBERS: "api/subscription/search-for-instructor",
    UPDATE_SUBSCRIPTION: "/api/subscription"
  },
  PURCHASE: {
    GET_PURCHASE_FOR_STUDENT: "api/purchase/search-for-student"
  }
};
