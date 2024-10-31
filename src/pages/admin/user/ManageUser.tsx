import { lazy, useState, useEffect } from "react";
import { Tabs } from "antd";
// import { UserRole } from "../../../models/prototype/User";
import { UserService } from "../../../services/admin/user.service";
import { GetUsersAdminParams } from "../../../models/api/request/admin/user.request.model";
// import { GetUsersAdminResponse } from "../../../models/api/responsive/admin/user.responsive.model";
import { User } from "../../../models/api/responsive/users/users.model"; // Ensure this import is correct
import { UserRoles } from "../../../app/enums";

const ViewUserProfile = lazy(() => import("../../../components/admin/user/ViewUserProfile"));
const CustomSearch = lazy(() => import("../../../components/generic/search/CustomSearch"));
const FilterRole = lazy(() => import("../../../components/admin/user/FilterRole"));
const FilterStatus = lazy(() => import("../../../components/admin/user/FilterStatus"));
const CreateUserProfile = lazy(() => import("../../../components/admin/user/CreateUserProfile"));

const ManageUser = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedRole, setSelectedRole] = useState<UserRoles | null>(null);
  const [selectedStatus, setSelectedStatus] = useState<boolean | null>(null);
  const [activeTab, setActiveTab] = useState("all");
  const [users, setUsers] = useState<User[] | null>(null);

  // Reset filters when changing tabs
  const handleTabChange = (key: string) => {
    setActiveTab(key);
    // Reset all filters when switching tabs
    setSelectedRole(null);
    setSelectedStatus(null);
    setSearchQuery("");
  };

  // Reset tab when applying filters
  const handleRoleChange = (role: UserRoles | null) => {
    setSelectedRole(role);
    if (activeTab !== "all") {
      setActiveTab("all");
    }
  };

  const handleStatusChange = (status: boolean | null) => {
    setSelectedStatus(status);
    if (activeTab !== "all") {
      setActiveTab("all");
    }
  };

  const handleSearch = (query: string) => {
    setSearchQuery(query);
  };

  const fetchUsers = async (params: GetUsersAdminParams) => {
    try {
      const response = await UserService.getUsersAdmin(params);
      return response.data;
    } catch (error) {
      console.error("Failed to fetch users:", error);
      throw error;
    }
  };

  useEffect(() => {
    const fetchUsersData = async () => {
      try {
        let searchCondition = {
          keyword: searchQuery,
          role: selectedRole || UserRoles.ALL,
          status: selectedStatus !== null ? selectedStatus : true,
          is_verified: true,
          is_deleted: false
        };

        // Modify search conditions based on active tab
        if (activeTab === "blocked") {
          searchCondition = {
            ...searchCondition,
            status: false,
            is_deleted: true
          };
        } else if (activeTab === "unverified") {
          searchCondition = {
            ...searchCondition,
            is_verified: false
          };
        }

        const response = await fetchUsers({
          searchCondition,
          pageInfo: {
            pageNum: 1,
            pageSize: 10
          }
        });

        if (response && response.success) {
          setUsers(response.data.pageData);
        }
      } catch (error) {
        console.error("Failed to fetch users:", error);
      }
    };

    fetchUsersData();
  }, [searchQuery, selectedRole, selectedStatus, activeTab]);

  const tabItems = [
    { label: "All", key: "all" },
    { label: "Blocked Account", key: "blocked" },
    { label: "Unverified Account", key: "unverified" }
  ];

  if (users === null) {
    return <div>Loading...</div>;
  } else {
    return (
      <div className="items-center justify-center border-b border-gray-300">
        <div className="flex flex-col items-center p-4 md:flex-row">
          <CustomSearch onSearch={handleSearch} placeholder="Search by name or email" className="search-input mr-4" />
          {activeTab === "all" && (
            <>
              <FilterRole onRoleChange={handleRoleChange} />
              <FilterStatus onStatusChange={handleStatusChange} />
            </>
          )}
          <CreateUserProfile />
        </div>
        <Tabs defaultActiveKey="all" onChange={handleTabChange} items={tabItems} className="ml-4" />
        <ViewUserProfile searchQuery={searchQuery} selectedRole={selectedRole} selectedStatus={selectedStatus} activeTab={activeTab} showActionColumn={activeTab !== "unverified"} disableActions={activeTab === "unverified"} />
      </div>
    );
  }
};

export default ManageUser;
