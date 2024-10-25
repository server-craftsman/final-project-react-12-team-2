import React, { useEffect } from "react";
import { Select } from "antd";

interface FilterStatusProps {
  onStatusChange: (status: boolean | null) => void;
}

const FilterStatus: React.FC<FilterStatusProps> = ({ onStatusChange }) => {
  useEffect(() => {
    // Example API call
    const fetchStatuses = async () => {
      try {
        // Replace with actual API call
        // console.log("Fetching statuses...");
      } catch (error) {
        console.error("Failed to fetch statuses:", error);
      }
    };

    fetchStatuses();
  }, []); // Empty dependency array means this runs once on mount

  return (
    <Select
      placeholder="Select Status"
      onChange={(value) =>
        onStatusChange(value === "all" ? null : value === "true" ? true : false)
      }
      allowClear
      style={{ width: 120, marginBottom: 10 }}
      defaultValue="all"
    >
      <Select.Option value="all">All</Select.Option>
      <Select.Option value="true">Active</Select.Option>
      <Select.Option value="false">Inactive</Select.Option>
    </Select>
  );
};

export default FilterStatus;
