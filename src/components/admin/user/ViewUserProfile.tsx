import React, { useEffect, useState } from "react";
import { Table } from "antd";
import { useNavigate } from "react-router-dom";
// import usersData from "../../../data/users.json"; // Adjust the path as necessary
// import { User, UserRole } from "../../../models/prototype/User";
import { userStatusColor } from "../../../utils/userStatus";
import { userRoleColor } from "../../../utils/userRole";
import { UserService } from "../../../services/admin/user.service";
import { UserRole } from "../../../models/prototype/User";
import { GetUsersAdminParams } from "../../../models/api/request/admin/user.request.model";
import { GetUsersAdminResponse } from "../../../models/api/responsive/admin/user.responsive.model";
import { User } from "../../../models/api/responsive/users/users.model";
import { ROUTER_URL } from "../../../const/router.path";

interface SearchCondition {
  keyword: string;
  role: UserRole | undefined;
  status: boolean | null;
  is_verified: boolean | null;
  is_deleted: boolean | null;
}

interface ViewUserProfileProps {
  searchQuery: string;
  selectedRole: UserRole | null;
  selectedStatus: boolean | null;
  activeTab: string;
}

const ViewUserProfile: React.FC<ViewUserProfileProps> = ({
  searchQuery,
  selectedRole,
  selectedStatus,
  activeTab,
}) => {
  const navigate = useNavigate();
  const [users, setUsers] = useState<GetUsersAdminResponse | null>(null);

  const defaultParams = {
    pageInfo: {
      pageNum: 1,
      pageSize: 10,
    },
    searchCondition: {
      keyword: "",
      role: UserRole.all,
      status: true,
      is_verified: true,
      is_deleted: false,
    },
  };

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const searchCondition: SearchCondition = {
          keyword: searchQuery || defaultParams.searchCondition.keyword,
          role: selectedRole || defaultParams.searchCondition.role,
          status: selectedStatus !== null ? selectedStatus : defaultParams.searchCondition.status ?? null,
          is_verified: null,
          is_deleted: null,
        };

        if (activeTab === "all") {
          searchCondition.role = UserRole.all;
          searchCondition.status = true;
          searchCondition.is_verified = true;
          searchCondition.is_deleted = false;
        } else if (activeTab === "blocked") {
          searchCondition.role = UserRole.all;
          searchCondition.status = false;
          searchCondition.is_verified = true;
          searchCondition.is_deleted = true;
        } else if (activeTab === "unverified") {
          searchCondition.role = UserRole.all;
          searchCondition.status = true;
          searchCondition.is_verified = false;
          searchCondition.is_deleted = false;
        }

        const params = {
          ...defaultParams,
          searchCondition,
        };

        const response = await UserService.getUsersAdmin(params as GetUsersAdminParams);

        const responseData = await response.data;
        if (responseData && responseData.data) {
          setUsers(responseData);
        } else {
          console.error("Unexpected response structure:", response);
          setUsers(null);
        }

      } catch (error) {
        console.error("Failed to fetch users:", error);
        setUsers(null);
      }
    };
    fetchUsers();
  }, [searchQuery, selectedRole, selectedStatus, activeTab]);

  const handleViewDetails = async (userId: string) => {
    try {
      const userDetails = await UserService.getUserDetails(userId);
      console.log(userDetails);
      navigate(ROUTER_URL.ADMIN.VIEW_USER_DETAILS.replace(":id", userId));
    } catch (error) {
      console.error("Failed to fetch user details:", error);
    }
  };

  const columns = [
    {
      title: "Name",
      dataIndex: "name",
      key: "name",
    },
    {
      title: "Email",
      dataIndex: "email",
      key: "email",
    },
    {
      title: "Role",
      dataIndex: "role",
      key: "role",
      render: (role: UserRole) => (
        <span className={userRoleColor(role)}>{role.toUpperCase()}</span>
      ),
    },
    {
      title: "Status",
      dataIndex: "status",
      key: "status",
      render: (status: boolean) => (
        <span className={userStatusColor(status)}>
          {status ? "Active" : "Inactive"}
        </span>
      ),
    },
    {
      title: "Balance",
      dataIndex: "balance",
      key: "balance",
    },
    {
      title: "Action",
      key: "action",
      render: (_: unknown, record: User) => (
        <div>
          <button
            onClick={() => handleViewDetails(record._id)}
            className="bg-gradient-tone rounded-md px-4 py-2 text-white"
          >
            View Details
          </button>
        </div>
      ),
    },
  ];

  return (
    <div className="-mt-3 mb-64 p-4">
      <Table<User>
        className="shadow-lg"
        columns={columns}
        dataSource={users?.data.pageData || []}
        rowKey="_id"
        pagination={{ pageSize: 10 }}
      />
    </div>
  );
};

export default ViewUserProfile;
