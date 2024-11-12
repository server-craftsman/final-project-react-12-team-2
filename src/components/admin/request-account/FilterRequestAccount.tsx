import React from "react";
import { Select } from "antd";

interface FilterRequestAccountProps {
  onStatusChange: (status: boolean | null) => void;
  filterStatus: boolean | null;
}

const FilterRequestAccount: React.FC<FilterRequestAccountProps> = ({ onStatusChange, filterStatus }) => {
  return (
    <div>
      <Select placeholder="Select Status" onChange={(value) => onStatusChange(value)} allowClear style={{ width: 120, marginBottom: 10 }} defaultValue={filterStatus}>
        <Select.Option value={null}>All</Select.Option>
        <Select.Option value={true}>Active</Select.Option>
        <Select.Option value={false}>Inactive</Select.Option>
      </Select>
    </div>
  );
};

export default FilterRequestAccount;
