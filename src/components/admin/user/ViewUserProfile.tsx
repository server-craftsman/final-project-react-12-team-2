import React, { useEffect, useState } from "react";
import { Table, Modal, message } from "antd";
import { useNavigate } from "react-router-dom";
import { EditOutlined } from "@ant-design/icons";
// import usersData from "../../../data/users.json"; // Adjust the path as necessary
// import { User, UserRole } from "../../../models/prototype/User";
// import { userStatusColor } from "../../../utils/userStatus";
import { userRoleColor } from "../../../utils/userRole";
import { UserService } from "../../../services/admin/user.service";
import { UserRole } from "../../../models/prototype/User";
import {
  GetUsersAdminParams,
  ChangeStatusParams,
  ChangeRoleParams,
} from "../../../models/api/request/admin/user.request.model";
import {
  GetUsersAdminResponse,
} from "../../../models/api/responsive/admin/user.responsive.model";
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

  useEffect(() => {
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

  const handleChangeStatus = async (userId: string, status: boolean) => {
    Modal.confirm({
      title: status ? 'Unblock Account' : 'Block Account',
      content: `Are you sure you want to ${status ? "unblock" : "block"} this account?`,
      onOk: async () => {
        try {
          const params = {
            user_id: userId,
            status,
          };
          const response = await UserService.changeStatus(userId, params as ChangeStatusParams);

          if (response.data.success) {
            message.success(`Account has been successfully ${status ? "unblocked" : "blocked"}.`);
            fetchUsers();
          } else {
            message.error(`Failed to ${status ? "unblock" : "block"} account. Please try again.`);
          }
        } catch (error) {
          console.error("Failed to change account status:", error);
          message.error(`An error occurred while ${status ? "unblocking" : "blocking"} the account. Please try again.`);
        }
      },
    });
  };

  const handleChangeRole = async (userId: string, currentRole: UserRole) => {
    const roleOptions = Object.values(UserRole).filter(role => role !== UserRole.all);
    
    // Modal with role selection (removed first confirmation)
    Modal.confirm({
      title: 'Select New Role',
      content: (
        <select 
          id="roleSelect"
          className="w-full p-2 border rounded-md mt-2"
          defaultValue={currentRole}
        >
          {roleOptions.map(role => (
            <option key={role} value={role}>{role.toUpperCase()}</option>
          ))}
        </select>
      ),
      onOk: async () => {
        const newRole = (document.getElementById('roleSelect') as HTMLSelectElement).value as UserRole;
        if (newRole === currentRole) {
          return;
        }

        // Final confirmation modal
        Modal.confirm({
          title: 'Confirm Role Change',
          content: `Are you sure you want to change the role from ${currentRole.toUpperCase()} to ${newRole.toUpperCase()}?`,
          onOk: async () => {
            try {
              const response = await UserService.changeRole(userId, { 
                user_id: userId, 
                role: newRole 
              } as ChangeRoleParams);

              if (response.data.success) {
                message.success(`Role updated to ${newRole.toUpperCase()}`);
                fetchUsers();
              }
            } catch (error) {
              message.error("Failed to update role");
            }
          }
        });
      }
    });
  };

  const columns = [
    {
      title: "Avatar",
      dataIndex: "avatar_url",
      key: "avatar_url",
      render: (avatar_url: string) => (
        <img src={avatar_url} alt="Avatar" className="w-10 h-10 rounded-full" />
      ),
    },
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
      render: (role: UserRole, record: User) => (
        <div className="flex items-center gap-2">
          <span className={`px-3 py-1 rounded-full ${userRoleColor(role)}`}>
            {role.toUpperCase()}
          </span>
          <button 
            onClick={() => handleChangeRole(record._id, role)}
            className="px-3 py-1 bg-blue-500 hover:bg-blue-600 text-white rounded-md transition-colors duration-200"
          >
            <span className="text-sm"><EditOutlined /></span>
          </button>
        </div>
      ),
    },
    {
      title: "Status",
      dataIndex: "status", 
      key: "status",
      render: (status: boolean, record: User) => (
        <div className="flex items-center justify-center">
          <button
            onClick={() => handleChangeStatus(record._id, !status)}
            className={`px-4 py-1.5 rounded-full font-medium transition-all duration-200 transform hover:scale-105
              ${status 
                ? "bg-gradient-to-r from-green-400 to-green-500 text-white hover:shadow-lg hover:from-green-500 hover:to-green-600 animate-fade-in" 
                : "bg-gradient-to-r from-red-400 to-red-500 text-white hover:shadow-lg hover:from-red-500 hover:to-red-600 animate-fade-in"
              }`}
          >
            <div className="flex items-center gap-2">
              <div className={`w-2 h-2 rounded-full ${status ? "bg-green-200" : "bg-red-200"} animate-pulse`}></div>
              <span className={`transition-all duration-300 ${status ? "animate-bounce-subtle" : "animate-shake-subtle"}`}>
                {status ? "ACTIVE" : "INACTIVE"}
              </span>
            </div>
          </button>
        </div>
      ),
    },
    // },
    // {
    //   title: "Balance",
    //   dataIndex: "balance",
    //   key: "balance",
    // },
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
