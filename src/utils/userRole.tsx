import { UserRole } from "../models/prototype/User";

export const userRoleColor = (role: UserRole) => {
  return role === UserRole.admin
    ? "bg-purple-100 text-purple-700 border border-purple-500 rounded-md px-2 py-1 text-xs capitalize"
    : role === UserRole.instructor
      ? "bg-yellow-100 text-yellow-700 border border-yellow-500 rounded-md px-2 py-1 text-xs capitalize"
      : "bg-orange-100 text-orange-700 border border-orange-500 rounded-md px-2 py-1 text-xs capitalize";
};
