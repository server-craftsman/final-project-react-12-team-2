import React from "react";
import { StatusType } from "../../../../app/enums";
import { Select } from "antd";

interface FilterStatusProps {
  onStatusChange: (status: StatusType | "") => void;
  currentStatus?: StatusType | "";
}

const FilterStatus: React.FC<FilterStatusProps> = ({ onStatusChange, currentStatus }) => {
  const handleChange = (value: string | undefined) => {
    if (value === undefined || value === "") {
      onStatusChange("");
    } else {
      onStatusChange(value as StatusType);
    }
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
    <Select
      style={{ width: 200 }}
      placeholder="Filter by status"
      allowClear
      onChange={handleChange}
      value={currentStatus || undefined}
    >
      <Select.Option key="all" value="">
        All
      </Select.Option>
      {Object.values(StatusType).map((status) => (
        <Select.Option key={status} value={status}>
          {renameStatus(status)}
        </Select.Option>
      ))}
    </Select>
  );
};

export default FilterStatus;
