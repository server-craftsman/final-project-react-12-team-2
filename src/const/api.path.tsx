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
    UPDATE_BLOG: "api/blog/:id"
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
  COURSE: {
    //instructor
    GET_COURSE: "api/course/search",
    CREATE_COURSE: "api/course",
    CHANGE_STATUS_COURSE: "api/course/change-status",
    GET_COURSE_BY_ID: "api/course/:id",
    //=========================================
    //public
    GET_PUBLIC_COURSE: "api/client/course/search"
    //=========================================
  }, 
  SESSION: {
    GET_SESSION: "api/session/search",
    CREATE_SESSION: "api/session"
  },
  LESSON: {
    GET_LESSON: "api/lesson/search",
    CREATE_LESSON: "api/lesson"
  },
  SUBSCRIPTION: {
    //instructor
    GET_SUBSCRIPTIONS: "api/subscription/search-for-subscribed"
  }
};
