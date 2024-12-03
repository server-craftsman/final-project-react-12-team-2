import React, { useEffect, useState } from "react";
import { Table, Modal, Button, Input, Radio } from "antd";
import { useNavigate } from "react-router-dom";
import { EditOutlined, LockOutlined, UnlockOutlined, DeleteOutlined, EyeOutlined } from "@ant-design/icons";
import { userRoleColor } from "../../../utils/userRole";
import { userStatusColor } from "../../../utils/userStatus";
import { UserService } from "../../../services/admin/user.service";
import { GetUsersAdminParams, ChangeStatusParams, ChangeRoleParams } from "../../../models/api/request/admin/user.request.model";
import { GetUsersAdminResponse } from "../../../models/api/responsive/admin/user.responsive.model";
import { User } from "../../../models/api/responsive/users/users.model";
import { ROUTER_URL } from "../../../const/router.path";
// Utils
import { helpers } from "../../../utils";
// handle request - response
import { UserRoles } from "../../../app/enums";
import { ColumnType } from "antd/es/table";
// import { HttpException } from "../../../app/exceptions";

interface SearchCondition {
  keyword: string;
  role: UserRoles | undefined;
  status: boolean | null;
  is_verified: boolean | null;
  is_deleted: boolean | null;
}

interface ViewUserProfileProps {
  searchQuery: string;
  selectedRole: UserRoles | null;
  selectedStatus: boolean | null;
  activeTab: string;
  showActionColumn: boolean;
  disableActions: boolean;
}

const ViewUserProfile: React.FC<ViewUserProfileProps> = ({ searchQuery, selectedRole, selectedStatus, activeTab, showActionColumn, disableActions }) => {
  const navigate = useNavigate();
  const [users, setUsers] = useState<GetUsersAdminResponse | null>(null);
  const [selectedUserIds, setSelectedUserIds] = useState<Set<string>>(new Set());
  const [pageInfo, setPageInfo] = useState<any>({});

  // Move outside component to prevent recreation on each render
  const defaultParams = {
    pageInfo: {
      pageNum: 1,
      pageSize: 10
    },
    searchCondition: {
      keyword: "",
      role: UserRoles.ALL,
      status: true,
      is_verified: true,
      is_deleted: false
    }
  } as const; // Make immutable

  // Memoize the search condition logic
  const getSearchCondition = React.useCallback((searchQuery: string, selectedRole: UserRoles | null, selectedStatus: boolean | null, activeTab: string): SearchCondition => {
    const baseCondition = {
      keyword: searchQuery, //debug
      role: UserRoles.ALL,
      status: true,
      is_verified: true,
      is_deleted: false
    };

    switch (activeTab) {
      case "all":
        return {
          ...baseCondition,
          role: selectedRole || UserRoles.ALL,
          status: selectedStatus !== null ? selectedStatus : true
        };
      case "blocked":
        return {
          ...baseCondition,
          keyword: searchQuery,
          status: false
        };
      case "unverified":
        return {
          ...baseCondition,
          keyword: searchQuery,
          is_verified: false
        };
      default:
        return baseCondition;
    }
  }, []);

  // Memoize fetchUsers to prevent unnecessary recreations
  const fetchUsers = React.useCallback(async (pageNum: number = defaultParams.pageInfo.pageNum, pageSize: number = defaultParams.pageInfo.pageSize) => {
    try {
      const searchCondition = getSearchCondition(searchQuery, selectedRole, selectedStatus, activeTab);
      const params = {
        pageInfo: { pageNum, pageSize },
        searchCondition
      };

      const response = await UserService.getUsersAdmin(params as GetUsersAdminParams);

      // Filter users based on searchQuery
      const filteredUsers = response.data.data.pageData.filter(
        (user) =>
          // user.role !== UserRoles.ALL &&
          user.name.includes(searchQuery) || user.email.includes(searchQuery)
      );

      setUsers({ ...response.data.data, pageData: filteredUsers });
      setPageInfo(response.data.data.pageInfo);
    } catch (error) {
      console.error("Failed to fetch users:", error);
      setUsers(null);
    }
  }, [searchQuery, selectedRole, selectedStatus, activeTab, getSearchCondition]);

  useEffect(() => {
    fetchUsers();
  }, [fetchUsers]);

  const handleViewDetails = React.useCallback(
    async (userId: string) => {
      try {
        await UserService.getUserDetails(userId);

        // if (!response.data?.success) {
        //   throw new HttpException("Failed to fetch user details", HTTP_STATUS.BAD_REQUEST);
        // }

        navigate(ROUTER_URL.ADMIN.VIEW_USER_DETAILS.replace(":id", userId));
      } catch (error) {
        // if (error instanceof HttpException) {
        //   message.error(error.message);
        // } else {
        helpers.notificationMessage("An unexpected error occurred while fetching user details", "error");
      }
    },
    [navigate]
  );

  const handleChangeStatus = async (userId: string, status: boolean) => {
    Modal.confirm({
      title: status ? "Unblock Account" : "Block Account",
      content: `Are you sure you want to ${status ? "unblock" : "block"} this account?`,
      onOk: async () => {
        try {
          const params = {
            user_id: userId,
            status
          };
          await UserService.changeStatus(userId, params as ChangeStatusParams);

          // if (!response.data?.success) {
          //   throw new HttpException(`Failed to ${status ? "unblock" : "block"} account`, HTTP_STATUS.BAD_REQUEST);
          // }

          helpers.notificationMessage(`Account has been successfully ${status ? "unblocked" : "blocked"}.`, "success");
          fetchUsers();
        } catch (error) {
          // if (error instanceof HttpException) {
          //   message.error(error.message);
          // } else {
          helpers.notificationMessage(`An unexpected error occurred while ${status ? "unblocking" : "blocking"} the account`, "error");
          // }
        }
      }
    });
  };

  const handleChangeRole = async (userId: string, currentRole: UserRoles) => {
    const roleOptions = Object.values(UserRoles).filter((role) => role !== UserRoles.ALL);

    // Modal with role selection (removed first confirmation)
    Modal.confirm({
      title: "Change New Role",
      content: (
        <select id="roleSelect" className="mt-2 w-full rounded-md border p-2" defaultValue={currentRole}>
          {roleOptions.map((role) => (
            <option key={role} value={role}>
              {role.toUpperCase()}
            </option>
          ))}
        </select>
      ),
      onOk: async () => {
        const newRole = (document.getElementById("roleSelect") as HTMLSelectElement).value as UserRoles;
        if (newRole === currentRole) {
          return;
        }

        // Final confirmation modal
        Modal.confirm({
          title: "Confirm Role Change",
          content: `Are you sure you want to change the role from ${currentRole.toUpperCase()} to ${newRole.toUpperCase()}?`,
          onOk: async () => {
            try {
              await UserService.changeRole(userId, {
                user_id: userId,
                role: newRole
              } as ChangeRoleParams);

              // if (!response.data?.success) {
              //   throw new HttpException("Failed to update role", HTTP_STATUS.BAD_REQUEST);
              // }

              helpers.notificationMessage(`Role updated to ${newRole.toUpperCase()}`);
              fetchUsers();
            } catch (error) {
              // if (error instanceof HttpException) {
              //   message.error(error.message);
              // } else {
              helpers.notificationMessage("An unexpected error occurred while updating role", "error");
              // }
            }
          }
        });
      }
    });
  };
  const handleSelectUser = (userId: string) => {
    setSelectedUserIds(new Set([userId]));
  };

  // const handleSelectAll = (checked: boolean) => {
  //   if (checked) {
  //     const allUserIds = users?.pageData.map((user) => user._id) || [];
  //     setSelectedUserIds(new Set(allUserIds));
  //   } else {
  //     setSelectedUserIds(new Set());
  //   }
  // };

  const handleDeleteSelected = async () => {
    if (activeTab !== "blocked" && activeTab !== "all") return;

    Modal.confirm({
      title: "Delete Selected Accounts",
      content: "Are you sure you want to delete the selected accounts?",
      onOk: async () => {
        try {
          const userIdsToDelete = users?.pageData
            .filter((user) => selectedUserIds.has(user._id))
            .map((user) => user._id);

          if (userIdsToDelete) {
            for (const userId of userIdsToDelete) {
              await UserService.deleteUser(userId);
            }
          }

          helpers.notificationMessage("Selected accounts have been successfully deleted.", "success");
          
          // Clear selected user IDs after successful deletion
          setSelectedUserIds(new Set()); //debug

          fetchUsers(); // Refresh the user list
        } catch (error) {
          helpers.notificationMessage("An error occurred while deleting accounts.", "error");
        }
      }
    });
  };

  // Memoize columns to prevent unnecessary recreations
  const columns = React.useMemo(() => {
    const baseColumns = [
      activeTab !== "unverified" && {
        title: "Select",
        dataIndex: "_id",
        key: "select",
        render: (userId: string) => (
          <Radio
            checked={selectedUserIds.has(userId)}
            onChange={() => handleSelectUser(userId)}
            disabled={users?.pageData.length === 1}
          />
        )
      },
      {
        title: "Avatar",
        dataIndex: "avatar_url",
        key: "avatar_url",
        render: (avatar_url: string, record: User) => {
          const initial = record.name && typeof record.name === 'string' ? record.name[0] : 'U'; // Use first character of name if valid
          return (
            <img
              src={avatar_url || `https://ui-avatars.com/api/?name=${initial}`}
              alt="Avatar"
              className="h-10 w-10 rounded-full"
              onError={(e) => {
                e.currentTarget.src = `https://ui-avatars.com/api/?name=${initial}`;
              }}
            />
          );
        }
      },
      {
        title: "Name",
        dataIndex: "name",
        key: "name"
      },
      {
        title: "Email",
        dataIndex: "email",
        key: "email"
      },
      !disableActions && {
        title: "Role",
        dataIndex: "role",
        key: "role",
        render: (role: UserRoles, record: User) => (
          <div className="flex items-center gap-2">
            <span className={`rounded-full px-3 py-1 ${userRoleColor(role)}`} style={{ width: "100px", textAlign: "center" }}>{role}</span>
            <button onClick={() => handleChangeRole(record._id, role)} className="rounded-md bg-blue-500 px-3 py-1 text-white transition-colors duration-200 hover:bg-blue-600" style={{ width: "40px" }}>
              <span className="text-sm">
                <EditOutlined />
              </span>
            </button>
          </div>
        )
      },
      !disableActions && {
        title: "Status",
        dataIndex: "status",
        key: "status",
        render: (status: boolean, record: User) => (
          <div className="flex items-center gap-2">
            <Input
              value={status ? "Active" : "Inactive"}
              readOnly
              className="w-32 border-none bg-gradient-to-r from-gray-50 to-gray-100 font-medium shadow-sm"
              style={{
                color: userStatusColor(status),
                borderRadius: "0.5rem",
                padding: "0.5rem 1rem",
                textAlign: "center"
              }}
            />
            <Button onClick={() => handleChangeStatus(record._id, !status)} className={`ml-2 rounded-full px-4 py-1 font-medium transition-all duration-200 ${status ? "bg-gradient-to-r from-green-400 to-green-500 text-white hover:from-green-500 hover:to-green-600" : "bg-gradient-to-r from-red-400 to-red-500 text-white hover:from-red-500 hover:to-red-600"}`}>
              {status ? <LockOutlined /> : <UnlockOutlined />}
            </Button>
          </div>
        )
      },
      {
        title: "Created At",
        dataIndex: "created_at",
        key: "created_at",
        render: (created_at: string) => helpers.formatDate(new Date(created_at))
      },
      showActionColumn && {
        title: "Action",
        key: "action",
        render: (_: unknown, record: User) => (
          <div>
            <button onClick={() => handleViewDetails(record._id)} className="bg-gradient-tone rounded-md px-4 py-2 text-white">
              <EyeOutlined />
            </button>
          </div>
        )
      }
    ].filter((column): column is Exclude<typeof column, false> => Boolean(column));

    // Add verify column if on unverified tab
    if (activeTab === "unverified") {
      baseColumns.splice(baseColumns.length - 1, 0, {
        title: "Verify",
        key: "verify",
        render: (_: unknown) => (
          <div>
            <button
              // onClick={() => handleVerifyUser(record._id)}  // Add onClick handler
              className="rounded-full bg-gradient-to-r from-gray-400 to-gray-500 px-4 py-1.5 text-white"
            >
              Not Verified
            </button>
          </div>
        )
      });
    }

    return baseColumns;
  }, [activeTab, handleViewDetails, handleChangeStatus, handleChangeRole, disableActions, selectedUserIds]);

  if (users && users.pageData.length > 0) {
    return (
      <div className="f -mt-3 mb-64 p-4">
        {(activeTab === "blocked" || activeTab === "all") && ( // Show delete button only in "blocked" tab
        <Button onClick={handleDeleteSelected} disabled={selectedUserIds.size === 0} className="mb-4 bg-red-500 text-white">
          <DeleteOutlined />
        </Button>
      )}
      <Table<User>
        className="shadow-lg"
        columns={columns as ColumnType<User>[]}
        dataSource={users?.pageData || []}
        rowKey="_id"
        pagination={{
          current: pageInfo.pageNum,
          pageSize: pageInfo.pageSize,
          total: pageInfo.totalItems,
          showTotal: (total, range) => `${range[0]}-${range[1]} of ${total} items`,
          onChange: (page, pageSize) => {
            fetchUsers(page, pageSize);
          },
          showSizeChanger: true,
          className: "bg-pagination", // Adjusted class for smaller text
          position: ["bottomLeft"]
        }}
      />
      </div>
    );
  } 
};

export default React.memo(ViewUserProfile);
