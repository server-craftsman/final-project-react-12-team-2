import React from "react";
import { StatusType } from "../../../../app/enums";
import { Select } from "antd";

interface FilterStatusProps {
  onStatusChange: (status: StatusType | "") => void;
}

const FilterStatus: React.FC<FilterStatusProps> = ({ onStatusChange }) => {
  const handleChange = (value: StatusType | "") => {
    onStatusChange(value);
  };

  const renameStatus = (status: StatusType) => {
    switch (status) {
      case StatusType.WAITING_APPROVE:
        return "Waiting for Approval";
      case StatusType.APPROVE:
        return "Approved";
      case StatusType.REJECT:
        return "Rejected";
      case StatusType.ACTIVE:
        return "Active";
      case StatusType.INACTIVE:
        return "Inactive";
      case StatusType.NEW:
        return "New";
      default:
        return "Unknown Status";
    }
  };

  return (
    <Select style={{ width: 200 }} placeholder="Filter by status" allowClear onChange={handleChange} defaultValue="">
      <Select.Option key="all" value="">
        All
      </Select.Option>
      {Object.values(StatusType).map((status) => {
        return (
          <Select.Option key={`status-${status}`} value={status}>
            {renameStatus(status)}
          </Select.Option>
        );
      })}
    </Select>
  );
};

export default FilterStatus;
