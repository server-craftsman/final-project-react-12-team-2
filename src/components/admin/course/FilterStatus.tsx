import React from "react";
import { CourseStatusEnum } from "../../../models/prototype/Course";
import { Select } from "antd";

interface FilterStatusProps {
  onStatusChange: (status: CourseStatusEnum | "") => void;
}

const FilterStatus: React.FC<FilterStatusProps> = ({ onStatusChange }) => {
  const handleChange = (value: CourseStatusEnum | "") => {
    onStatusChange(value);
  };

  const renameStatus = (status: CourseStatusEnum) => {
    switch (status) {
      case CourseStatusEnum.waiting_approve:
        return "Waiting for Approval";
      case CourseStatusEnum.approve:
        return "Approved";
      case CourseStatusEnum.reject:
        return "Rejected";
      default:
        return null;
    }
  };

  return (
    <Select style={{ width: 200 }} placeholder="Filter by status" allowClear onChange={handleChange} defaultValue="">
      <Select.Option key="all" value="">
        All
      </Select.Option>
      {Object.values(CourseStatusEnum)
        .filter((status) => 
          status === CourseStatusEnum.waiting_approve || 
          status === CourseStatusEnum.approve || 
          status === CourseStatusEnum.reject
        )
        .map((status) => {
          return (
            <Select.Option key={status} value={status}>
              {renameStatus(status)}
            </Select.Option>
          );
        })}
    </Select>
  );
};

export default FilterStatus;
