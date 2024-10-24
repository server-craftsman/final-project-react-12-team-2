import React, { useEffect, useState } from "react";
import { Table, Select } from "antd";
import { useNavigate } from "react-router-dom";
// import usersData from "../../../data/users.json"; // Adjust the path as necessary
// import { User, UserRole } from "../../../models/prototype/User";
import { userStatusColor } from "../../../utils/userStatus";
import { userRoleColor } from "../../../utils/userRole";
import { UserService } from "../../../services/admin/user.service";
import { User, UserRole } from "../../../models/prototype/User";

interface ViewUserProfileProps {
  searchQuery: string;
  selectedRole: UserRole | null;
  selectedStatus: boolean | null;
}

const ViewUserProfile: React.FC<ViewUserProfileProps> = ({
  searchQuery,
  selectedRole,
  selectedStatus,
}: ViewUserProfileProps) => {
  const navigate = useNavigate();
  const [users, setUsers] = useState<User[]>([]);

  const defaultParams = {
    pageInfo: {
      pageNum: 1,
      pageSize: 10,
    },
    searchCondition: {
      keyword: "",
      role: "admin",
      status: true,
      // is_verified: "false", // Change from "" to false or true as needed
      is_delete: false,
    },
  };

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        console.log("Fetching users with params:", {
          ...defaultParams,
          searchCondition: {
            ...defaultParams.searchCondition,
            keyword: searchQuery || defaultParams.searchCondition.keyword,
            role: selectedRole || defaultParams.searchCondition.role,
            status: selectedStatus !== null ? selectedStatus : defaultParams.searchCondition.status,
          },
        });

        const response = await UserService.getUsersAdmin({
          ...defaultParams,
          searchCondition: {
            ...defaultParams.searchCondition,
            keyword: searchQuery || defaultParams.searchCondition.keyword,
            role: selectedRole || defaultParams.searchCondition.role,
            status: selectedStatus !== null ? selectedStatus : defaultParams.searchCondition.status,
          },
        });

        console.log("API response:", response);

        setUsers(response.data.pageData ? response.data.pageData as unknown as User[] : []); // Ensure pageData is an array
      } catch (error) {
        console.error("Failed to fetch users:", error);
        setUsers([]); // Set users to an empty array on error
      }
    };

    fetchUsers();
  }, [searchQuery, selectedRole, selectedStatus]);

  const handleViewDetails = async (userId: string) => {
    try {
      const userDetails = await UserService.getUsersAdmin({
        ...defaultParams,
        searchCondition: {
          ...defaultParams.searchCondition,
          keyword: userId,
        },
      });
      console.log(userDetails); // You can handle the user details as needed
      navigate(`/admin/view-user/${userId}`);
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
            onClick={() => handleViewDetails(record.id)}
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
        dataSource={users.map((user) => ({
          ...user,
          dob: new Date(user.dob),
        }))}
        rowKey="id"
        pagination={{ pageSize: 10 }}
      />
    </div>
  );
};

export default ViewUserProfile;
