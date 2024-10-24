import { CourseStatusEnum } from "../models/prototype/Course";
import React from "react";


// export const courseStatusColor = (status: CourseStatusEnum): string => {
//   let classNames = "";

//   switch (status) {
//     case "waiting_approve":
//       classNames = "bg-yellow-100 text-yellow-700 border border-yellow-500";
//       break;
//     case "approve":
//       classNames = "bg-green-100 text-green-700 border border-green-500";
//       break;
//     case "reject":
//       classNames = "bg-red-100 text-red-700 border border-red-500";
//       break;
//     case "active":
//       classNames = "bg-blue-100 text-blue-700 border border-blue-500";
//       break;
//     case "inactive":
//       classNames = "bg-gray-100 text-gray-700 border border-gray-500";
//       break;
//     case "new":
//       classNames = "bg-purple-100 text-purple-700 border border-purple-500";
//       break;
//     default:
//       classNames = "";
//   }

//   return classNames;
// };

// Add a new component for rendering the status badge
export const CourseStatusBadge: React.FC<{ status: CourseStatusEnum }> = ({ status }) => {
  const classNames = courseStatusColor[status];
  return (
    <span className={`${classNames} rounded-md px-2 py-1 text-xs capitalize`}>
      {status}
    </span>
  );
};

export const courseStatusColor: Record<CourseStatusEnum, string> = {
  [CourseStatusEnum.waiting_approve]: 'p-1 rounded-md bg-amber-50 text-amber-800 border border-amber-400 shadow-sm',
  [CourseStatusEnum.approve]: 'p-1 rounded-md bg-emerald-50 text-emerald-800 border border-emerald-400 shadow-sm', 
  [CourseStatusEnum.reject]: 'p-1 rounded-md bg-rose-50 text-rose-800 border border-rose-400 shadow-sm',
  [CourseStatusEnum.active]: 'p-1 rounded-md bg-indigo-50 text-indigo-800 border border-indigo-400 shadow-sm',
  [CourseStatusEnum.inactive]: 'p-1 rounded-md bg-slate-50 text-slate-800 border border-slate-400 shadow-sm',
  [CourseStatusEnum.new]: 'p-1 rounded-md bg-violet-50 text-violet-800 border border-violet-400 shadow-sm',
};

export const getCourseStatusName = (status: CourseStatusEnum): string => {
  return status;
};
