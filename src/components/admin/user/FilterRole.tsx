import React, { useEffect } from "react";
import { Select } from "antd";
import { UserRole } from "../../../models/prototype/User";

interface FilterRoleProps {
  onRoleChange: (role: UserRole | null) => void;
}

const FilterRole: React.FC<FilterRoleProps> = ({ onRoleChange }) => {
  const rolesToInclude = [
    UserRole.instructor,
    UserRole.admin,
    UserRole.student,
  ];

  useEffect(() => {
    // Example API call
    const fetchRoles = async () => {
      try {
        // Replace with actual API call
        // console.log("Fetching roles...");
      } catch (error) {
        console.error("Failed to fetch roles:", error);
      }
    };

    fetchRoles();
  }, []); // Empty dependency array means this runs once on mount

  return (
    <Select
      placeholder="Select Role"
      onChange={(value) =>
        onRoleChange(value === "all" ? null : (value as UserRole))
      }
      allowClear
      style={{ width: 120, marginBottom: 10, marginRight: 10 }}
      defaultValue="all"
    >
      <Select.Option value="all">All</Select.Option>
      {rolesToInclude.map((role) => (
        <Select.Option key={role} value={role}>
          {role.charAt(0).toUpperCase() + role.slice(1)}
        </Select.Option>
      ))}
    </Select>
  );
};

export default FilterRole;
