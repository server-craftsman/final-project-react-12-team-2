import React from "react";
import { Select } from "antd";
import { PurchaseStatusEnum } from "../../../models/prototype/Purchases";

interface FilterStatusPurchasesProps {
  onFilterChange: (status: string) => void;
  filterStatus: string;
}

const FilterStatusPurchases: React.FC<FilterStatusPurchasesProps> = ({
  onFilterChange,
  filterStatus,
}) => {
  const handleStatusChange = (value: string) => {
    onFilterChange(value);
  };

  return (
    <div>
      <Select
        placeholder="Select Status"
        onChange={handleStatusChange}
        value={filterStatus}
        style={{ width: 200, marginTop: "10px" }}
      >
        <Select.Option value="">All</Select.Option>
        <Select.Option value={PurchaseStatusEnum.new}>New</Select.Option>
        <Select.Option value={PurchaseStatusEnum.request_paid}>
          Request Paid
        </Select.Option>
        <Select.Option value={PurchaseStatusEnum.completed}>
          Completed
        </Select.Option>
      </Select>
    </div>
  );
};

export default FilterStatusPurchases;
