export interface RoutePaths {
  LOGIN: string;
  REGISTER: string;
  // ADMIN_PATH: string;
  ADMIN: {
    BASE: string;
    INFO: string;
    MANAGE_USER: string;
    VIEW_USER: string;
    VIEW_USER_DETAILS: string;
    EDIT_USER: string;
    PAYOUT: string;
    PURCHASE: string;
    VIEW_PURCHASE: string;
    CATEGORIES: string;
    EDIT_CATEGORY: string;
    COURSES: string;
    PURCHASES_LOG: string;
    CATEGORIES_DETAILS: string;
    CATEGORIES_DETAILS_ID: string;
    COURSES_LOG: string;
    SUBSCRIPTION: string;
    REQUEST_ACCOUNT: string;
  };
  INSTRUCTOR: {
    BASE: string;
    SETTING: string;
    EDIT_USER: string;
    INFO: string;
    REVIEWS: string;
    PURCHASES: string;
    PAYOUT: string;
    VIEW_TRANSACTIONS: string;
    ORDERS: string;
    COURSES: string;
    SUBSCRIPTION: string;
  };
  STUDENT: {
    BASE: string;
    SETTING: string;
    ORDERS: string;
    SUBSCRIPTION: string;
    EDIT_USER: string;
  };
  COMMON: {
    HOME: string;
    COURSE_DETAILS: string;
    COURSE_BY_ID: string;
    COURSE_BY_ID_LESSON: string;
    COURSE_BY_ID_SESSION: string;
    COURSE_BY_ID_SESSION_LESSON: string;
    SESSION_DETAILS: string;
    LESSON_DETAILS: string;
    CART: string;
    ABOUT: string;
  };
  UNAUTHORIZED: string;
}
