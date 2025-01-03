import { Select } from "antd";
import React from "react";
import { CourseStatusEnum } from "../../../models/prototype/Course";

const renameStatus = (status: string) => {
  switch (status) {
    case CourseStatusEnum.waiting_approve:
      return "Waiting Approve";
    case CourseStatusEnum.approve:
      return "Approve";
    case CourseStatusEnum.reject:
      return "Reject";
    case CourseStatusEnum.active:
      return "Active";
    case CourseStatusEnum.inactive:
      return "Inactive";
    case CourseStatusEnum.new:
      return "New";
    default:
      return status;
  }
};
const FilterStatus: React.FC<{
  status: string;
  onStatusChange: (status: string) => void;
}> = ({ status, onStatusChange }) => {
  return (
    <div className="flex items-center">
      <Select value={status} onChange={(value) => onStatusChange(value)} style={{ width: 200 }}>
        <Select.Option value="all">All</Select.Option>
        {Object.values(CourseStatusEnum).map((statusOption) => (
          <Select.Option key={statusOption} value={statusOption}>
            {renameStatus(statusOption)}
          </Select.Option>
        ))}
      </Select>
    </div>
  );
};

export default FilterStatus;
