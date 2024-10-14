import { CourseStatusEnum } from "../models/Course";

export const courseStatusColor = (status: CourseStatusEnum) => {
  switch (status) {
    case "waiting_approve":
      return "bg-yellow-100 text-yellow-700 border border-yellow-500 rounded-md px-2 py-1 text-xs capitalize";
    case "approve":
      return "bg-green-100 text-green-700 border border-green-500 rounded-md px-2 py-1 text-xs capitalize";
    case "reject":
      return "bg-red-100 text-red-700 border border-red-500 rounded-md px-2 py-1 text-xs capitalize";
    case "active":
      return "bg-blue-100 text-blue-700 border border-blue-500 rounded-md px-2 py-1 text-xs capitalize";
    case "inactive":
      return "bg-gray-100 text-gray-700 border border-gray-500 rounded-md px-2 py-1 text-xs capitalize";
    case "new":
      return "bg-purple-100 text-purple-700 border border-purple-500 rounded-md px-2 py-1 text-xs capitalize";
  }
};