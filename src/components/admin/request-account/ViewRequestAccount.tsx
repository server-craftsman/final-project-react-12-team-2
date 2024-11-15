import React, { useEffect, useState, useCallback, useMemo } from "react";
import { Table, Modal, message, Button, Avatar, Input } from "antd";
import { CheckOutlined, CloseOutlined } from "@ant-design/icons";
import { UserRoles } from "../../../app/enums";
import { userStatusColor } from "../../../utils/userStatus";
import { UserService } from "../../../services/admin/user.service";
import { User } from "../../../models/api/responsive/users/users.model";
import { GetUsersAdminParams, ReviewProfileInstructorParams, ReviewStatus } from "../../../models/api/request/admin/user.request.model";
import { HTTP_STATUS } from "../../../app/enums";
import { HttpException } from "../../../app/exceptions";
import { helpers } from "../../../utils";
import { userRoleColor } from "../../../utils/userRole";
import LoadingAnimation from "../../../app/UI/LoadingAnimation";
interface ViewRequestAccountProps {
  searchQuery: string;
  refreshKey: number;
}

interface SearchCondition {
  keyword: string;
  role: UserRoles | undefined;
  status: boolean | null;
  is_verified: boolean | undefined;
  is_deleted: boolean | undefined;
}

const ViewRequestAccount: React.FC<ViewRequestAccountProps> = ({ searchQuery, refreshKey }) => {
  const [updatedUsers, setUpdatedUsers] = useState<string[]>([]);
  const [filteredUsers, setFilteredUsers] = useState<User[]>([]);
  const [pageInfo, setPageInfo] = useState<any>({});
  const [loading, setLoading] = useState<boolean>(true);

  const defaultParams = {
    searchCondition: {
      keyword: "",
      status: true,
      is_verified: false,
      role: UserRoles.INSTRUCTOR,
      is_deleted: false
    },
    pageInfo: {
      pageNum: 1,
      pageSize: 10
    }
  } as const;

  const getSearchCondition = useCallback(
    (searchQuery: string): SearchCondition => {
      return {
        keyword: searchQuery || defaultParams.searchCondition.keyword,
        status: defaultParams.searchCondition.status,
        is_verified: false,
        role: UserRoles.INSTRUCTOR,
        is_deleted: false
      };
    },
    [searchQuery, refreshKey]
  );

  const fetchingUsers = useCallback(async (pageNum: number = defaultParams.pageInfo.pageNum, pageSize: number = defaultParams.pageInfo.pageSize) => {
    setLoading(true);
    try {
      const searchCondition = getSearchCondition(searchQuery);
      const params = {
        searchCondition,
        pageInfo: { pageNum, pageSize },
      };

      const response = await UserService.getUsersAdmin(params as GetUsersAdminParams);

      if (!response.data?.success) {
        throw new HttpException("Failed to fetch users", HTTP_STATUS.BAD_REQUEST);
      }

      const users = response.data.data?.pageData.map((user: User) => ({
        ...user,
        role: user.role as UserRoles,
        status: Boolean(user.status) // Ensure status is a boolean
      }));

      setFilteredUsers(users);
      setPageInfo(response.data.data.pageInfo);
    } catch (error: any) {
      if (error.response) {
        console.error("Error response:", error.response.data);
        message.error(`Error: ${error.response.data.message || "An unexpected error occurred while fetching users"}`);
      } else if (error.request) {
        console.error("Error request:", error.request);
        message.error("No response received from server.");
      } else {
        console.error("Error message:", error.message);
        message.error("An unexpected error occurred.");
      }
    } finally {
      setLoading(false);
    }
  }, [searchQuery, getSearchCondition]);

  useEffect(() => {
    fetchingUsers();
  }, [fetchingUsers]);

  const handleApprove = useCallback(
    async (userId: string, isVerified: boolean) => {
      const user = filteredUsers.find((user) => user._id === userId);

      if (user) {
        Modal.confirm({
          title: `Are you sure you want to ${isVerified ? "approve" : "reject"} this user?`,
          onOk: async () => {
            if (isVerified && user.status === false) {
              message.error("Cannot approve an inactive user.");
              return;
            }

            try {
              const statusString = isVerified ? "approve" : "reject";

              const response = await UserService.reviewProfileInstructor({
                user_id: userId,
                status: statusString as ReviewStatus,
                comment: ""
              } as ReviewProfileInstructorParams);

              if (response.data?.success) {
                const updatedUserList = updatedUsers.includes(userId) ? updatedUsers : [...updatedUsers, userId];

                setUpdatedUsers(updatedUserList);
                message.success(`User ID: ${userId} has been ${statusString}`);
              } else {
                message.error("Failed to update user status.");
              }
            } catch (error: any) {
              console.error("API error:", error);
              message.error("An error occurred while updating user status.");
            }
          },
          onCancel: () => {
            message.info("Action canceled.");
          }
        });
      }
    },
    [filteredUsers, updatedUsers]
  );

  const columns = useMemo(
    () => [
      {
        title: "Avatar",
        dataIndex: "avatar_url",
        key: "avatar_url",
        render: (avatar_url: string) => <Avatar src={avatar_url} />
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
      {
        title: "Phone",
        dataIndex: "phone_number",
        key: "phone_number"
      },
      {
        title: "Role",
        dataIndex: "role",
        key: "role",
        render: (role: UserRoles) => <span className={userRoleColor(role)}>{role}</span>
      },
      {
        title: "Created At",
        dataIndex: "created_at",
        key: "created_at",
        render: (created_at: string) => helpers.formatDate(new Date(created_at))
      },
      {
        title: "Status",
        dataIndex: "status",
        key: "status",
        render: (status: boolean) => (
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
          </div>
        )
      },
      {
        title: "Action",
        key: "action",
        render: (_: unknown, record: User) => (
          <div className="flex items-center" style={{ minHeight: "48px" }}>
            {!record.is_verified && !updatedUsers.includes(record._id) && (
              <>
                <Button onClick={() => handleApprove(record._id, true)} className="rounded-md bg-blue-500 px-4 py-2 text-white transition-all duration-200 hover:bg-blue-600" style={{ width: "48px", marginRight: "4px" }} title="Approve">
                  <CheckOutlined />
                </Button>
                <Button onClick={() => handleApprove(record._id, false)} className="rounded-md bg-red-500 px-4 py-2 text-white transition-all duration-200 hover:bg-red-600" style={{ width: "48px" }} title="Reject">
                  <CloseOutlined />
                </Button>
              </>
            )}
            {updatedUsers.includes(record._id) && <span className="text-green-500">Completed</span>}
          </div>
        )
      }
    ],
    [handleApprove, updatedUsers]
  );

  if (loading) {
    return <LoadingAnimation />;
  }

  if (filteredUsers && pageInfo && columns) {
    return (
      <div className="-mt-3 mb-64 p-4">
        <Table<User> 
          className="shadow-lg" 
          columns={columns} 
          dataSource={filteredUsers} 
          rowKey="_id" 
          pagination={{
            current: pageInfo.pageNum,
            pageSize: pageInfo.pageSize,
            total: pageInfo.totalItems,
            showTotal: (total, range) => `${range[0]}-${range[1]} of ${total} items`,
            onChange: (page, pageSize) => {
              fetchingUsers(page, pageSize);
            },
            showSizeChanger: true,
            className: "bg-pagination", // Adjusted class for smaller text
            position: ["bottomLeft"]
          }} 
        />
      </div>
    );
  } else {
    return <LoadingAnimation />;
  }
};

export default React.memo(ViewRequestAccount);
