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
    DELETE_USER: "api/users/:id"
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
  }
};
