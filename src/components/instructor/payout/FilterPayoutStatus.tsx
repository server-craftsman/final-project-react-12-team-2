import React, { useCallback, useMemo } from "react";
import { Select } from "antd";
import { PayoutStatusEnum } from "../../../models/prototype/Payout";

const { Option } = Select;

const FilterStatus: React.FC<{
  filterStatus: string;
  setFilterStatus: (status: string) => void;
}> = ({ filterStatus, setFilterStatus }) => {
  const handleStatusChange = useCallback(
    (value: string) => {
      setFilterStatus(value);
    },
    [setFilterStatus]
  );

  const statusOptions = useMemo(
    () =>
      Object.values(PayoutStatusEnum).map((status) => (
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
