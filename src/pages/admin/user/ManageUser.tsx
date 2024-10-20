import { lazy, useState } from "react";
import { UserRole } from "../../../models/User";

const ViewUserProfile = lazy(
  () => import("../../../components/admin/user/ViewUserProfile"),
);
const CustomSearch = lazy(
  () => import("../../../components/generic/search/CustomSearch"),
);
const FilterRole = lazy(
  () => import("../../../components/admin/user/FilterRole"),
);
const FilterStatus = lazy(
  () => import("../../../components/admin/user/FilterStatus"),
);
const CreateUserProfile = lazy(
  () => import("../../../components/admin/user/CreateUserProfile"),
);

const ManageUser = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedRole, setSelectedRole] = useState<UserRole | null>(null);
  const [selectedStatus, setSelectedStatus] = useState<boolean | null>(null);

  const handleSearch = (query: string) => {
    setSearchQuery(query);
  };

  const handleRoleChange = (role: UserRole | null) => {
    setSelectedRole(role);
  };

  const handleStatusChange = (status: boolean | null) => {
    setSelectedStatus(status);
  };

  return (
    <div className="items-center justify-center border-b border-gray-300">
      <div className="flex flex-col items-center p-4 md:flex-row">
        <CustomSearch
          onSearch={handleSearch}
          placeholder="Search by name or email"
          className="search-input mr-4"
        />
        <FilterRole onRoleChange={handleRoleChange} />
        <FilterStatus onStatusChange={handleStatusChange} />
        <CreateUserProfile />
      </div>
      <ViewUserProfile
        searchQuery={searchQuery}
        selectedRole={selectedRole}
        selectedStatus={selectedStatus}
      />
    </div>
  );
};

export default ManageUser;
