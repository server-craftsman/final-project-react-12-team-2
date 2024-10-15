import { Select } from "antd";
import React from "react";
import { PurchaseStatusEnum } from "../../../models/Purchases";

const renameStatus = (status: string) => {
  switch (status) {
    case PurchaseStatusEnum.new:
      return "New";
    case PurchaseStatusEnum.request_paid:
      return "Request Paid";
    case PurchaseStatusEnum.completed:
      return "Completed";
    default:
      return status;
  }
};

const FilterStatus: React.FC<{
  status: string;
  setStatus: (status: string) => void;
}> = ({ status, setStatus }) => {
  return (
    <div className="flex items-center">
      <Select
        value={status}
        onChange={(value) => setStatus(value)}
        style={{ width: 120 }}
      >
        <Select.Option value="all">All</Select.Option>
        {Object.values(PurchaseStatusEnum).map((statusOption) => (
          <Select.Option key={statusOption} value={statusOption}>
            {renameStatus(statusOption)}
          </Select.Option>
        ))}
      </Select>
    </div>
  );
};

export default FilterStatus;
