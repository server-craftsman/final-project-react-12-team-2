export const API = {
  AUTH: {
    LOGIN: "api/auth",
    LOGOUT: "api/auth/logout",
    LOGIN_GOOGLE: "api/auth/google",
    REGISTER_GOOGLE_PUBLIC: "api/users/google",
    REGISTER: "api/auth/register",
    VERIFY_TOKEN: "api/auth/verify-token",
  },
  ADMIN: {
    GET_USERS: "api/users/search",
    GET_USER_DETAILS: "api/users/:id",
    UPDATE_USER: "api/users/:id",
    CHANGE_STATUS: "api/users/change-status",
    CHANGE_ROLE: "api/users/change-role",
    DELETE_USER: "api/users/:id",
  },
};
