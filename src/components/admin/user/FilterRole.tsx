import React from "react";
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

  return (
    <Select
      placeholder="Select Role"
      onChange={(value) => onRoleChange(value)}
      allowClear
      style={{ width: 120, marginBottom: 10, marginRight: 10 }}
      defaultValue={null}
    >
      <Select.Option value={null}>All</Select.Option>
      {rolesToInclude.map((role) => (
        <Select.Option key={role} value={role}>
          {role.charAt(0).toUpperCase() + role.slice(1)}
        </Select.Option>
      ))}
    </Select>
  );
};

export default FilterRole;
