import React from "react";
import { StatusType } from "../../../app/enums";
import { Select } from "antd";

interface FilterStatusProps {
  onStatusChange: (status: StatusType | "") => void;
  statusFilter: StatusType | "";
}

const FilterStatus: React.FC<FilterStatusProps> = ({ onStatusChange, statusFilter }) => {
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
      default:
        return null;
    }
  };

  return (
    <Select style={{ width: 200 }} placeholder="Filter by status" allowClear onChange={handleChange} value={statusFilter || undefined} defaultValue="">
      <Select.Option key="all" value="">
        All
      </Select.Option>
      {Object.values(StatusType)
        .filter((status) => status === StatusType.WAITING_APPROVE || status === StatusType.APPROVE || status === StatusType.REJECT)
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
