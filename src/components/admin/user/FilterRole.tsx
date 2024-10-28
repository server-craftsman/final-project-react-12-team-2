import React, { useEffect } from "react";
import { Select } from "antd";
import { UserRoles } from "../../../app/enums";

interface FilterRoleProps {
  onRoleChange: (role: UserRoles | null) => void;
}

const FilterRole: React.FC<FilterRoleProps> = ({ onRoleChange }) => {
  const rolesToInclude = [UserRoles.INSTRUCTOR, UserRoles.ADMIN, UserRoles.STUDENT];

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
    <Select placeholder="Select Role" onChange={(value) => onRoleChange(value === "all" ? null : (value as UserRoles))} allowClear style={{ width: 120, marginBottom: 10, marginRight: 10 }} defaultValue="all">
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
