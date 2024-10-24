import { CourseStatusEnum } from "../models/Course";


export const courseStatusColor = (status: CourseStatusEnum) => {
  let classNames = "";

  switch (status) {
    case "waiting_approve":
      classNames = "bg-yellow-100 text-yellow-700 border border-yellow-500";
      break;
    case "approve":
      classNames = "bg-green-100 text-green-700 border border-green-500";
      break;
    case "reject":
      classNames = "bg-red-100 text-red-700 border border-red-500";
      break;
    case "active":
      classNames = "bg-blue-100 text-blue-700 border border-blue-500";
      break;
    case "inactive":
      classNames = "bg-gray-100 text-gray-700 border border-gray-500";
      break;
    case "new":
      classNames = "bg-purple-100 text-purple-700 border border-purple-500";
      break;
    default:
      classNames = "";
  }

  return (
    <span className={`${classNames} rounded-md px-2 py-1 text-xs capitalize`}>
      {status}
    </span>
  );
};
