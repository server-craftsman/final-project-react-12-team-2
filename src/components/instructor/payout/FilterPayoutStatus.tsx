import React, { useCallback, useMemo } from "react";
import { Select } from "antd";
import { PayoutStatus } from "../../../app/enums/payout.status";
const { Option } = Select;

const FilterStatus: React.FC<{
  onFilterChange: (status: PayoutStatus | "") => void;
  filterStatus: PayoutStatus | "";
}> = ({ onFilterChange, filterStatus }) => {
  const handleStatusChange = useCallback(
    (value: PayoutStatus | "") => {
      onFilterChange(value);
    },
    [onFilterChange]
  );

  const statusOptions = useMemo(
    () =>
      Object.values(PayoutStatus).map((status) => (
        <Option key={status} value={status}>
          {status.toUpperCase()}
        </Option>
      )),
    []
  );

  return (
    <div className="mb-4">
      <Select style={{ width: 200 }} placeholder="Filter by status" onChange={handleStatusChange} value={filterStatus || undefined} defaultValue="">
        <Option value="">All</Option>
        {statusOptions}
      </Select>
    </div>
  );
};

export default React.memo(FilterStatus);
