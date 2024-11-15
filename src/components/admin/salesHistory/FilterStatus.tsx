import { Select } from "antd";
import React from "react";
import { PurchaseStatus } from "../../../app/enums/purchase.status"
interface FilterStatusPurchasesProps {
  onFilterChange: (status: PurchaseStatus | "") => void;
  filterStatus: PurchaseStatus | "";
}

const FilterStatus: React.FC<FilterStatusPurchasesProps> = ({ onFilterChange, filterStatus }) => {
  const handleStatusChange = (value: PurchaseStatus | "") => {
    onFilterChange(value);
  };

  return (
    <div>
      <Select placeholder="Select Status" onChange={handleStatusChange} value={filterStatus} style={{ width: 200, marginTop: "10px" }}>
        <Select.Option value="">All</Select.Option>
        <Select.Option value={PurchaseStatus.NEW}>New</Select.Option>
        <Select.Option value={PurchaseStatus.REQUEST_PAID}>Request Paid</Select.Option>
        <Select.Option value={PurchaseStatus.COMPLETED}>Completed</Select.Option>
      </Select>
    </div>
  );
};

export default FilterStatus;
