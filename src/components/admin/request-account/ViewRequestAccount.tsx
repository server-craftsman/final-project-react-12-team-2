import { Table, message, Modal } from "antd";
// import { useNavigate } from "react-router-dom";
import usersData from "../../../data/users.json"; // Adjust the path as necessary
import { User, UserRole } from "../../../models/prototype/User";
import { userStatusColor } from "../../../utils/userStatus";
import { useState } from "react";

interface ViewRequestAccount {
  searchQuery: string;
  selectedStatus: boolean | null;
}

const ViewRequestAccount = ({ searchQuery, selectedStatus }: ViewRequestAccount) => {
  const [updatedUsers, setUpdatedUsers] = useState<string[]>([]); // State to track updated user IDs

  // const navigate = useNavigate();

  // const handleViewDetails = (userId: string) => {
  //   navigate(`/admin/view-user/${userId}`);
  // };

  // Filter users to only include those who are not verified (is_verified is false)
  const filteredUsers = usersData.users
    .filter(
      (user) =>
        !user.is_verified && // Only show users who are not verified
        (user.name.toLowerCase().includes(searchQuery.toLowerCase()) || user.email.toLowerCase().includes(searchQuery.toLowerCase())) &&
        (selectedStatus === null || user.status === selectedStatus)
    )
    .map((user) => ({
      ...user,
      role: user.role as UserRole
    }));

  // Handle approve/reject actions with confirmation
  const handleApprove = (userId: string, isVerified: boolean) => {
    const user = filteredUsers.find((user) => user.id === userId);

    if (user) {
      // Show confirmation modal before approving or rejecting
      Modal.confirm({
        title: `Are you sure you want to ${isVerified ? "approve" : "reject"} this user?`,
        onOk: () => {
          // Check if the user is active before approving
          if (isVerified && user.status === false) {
            message.error("Cannot approve an inactive user.");
            return;
          }

          // Update the users state to reflect the approval or rejection
          const updatedUserList = updatedUsers.includes(userId)
            ? updatedUsers // If already updated, keep the same list
            : [...updatedUsers, userId]; // Otherwise, add the userId to the list

          setUpdatedUsers(updatedUserList); // Update the state

          // Here you would typically trigger an API call to update the backend
          console.log("Updated user status for ID:", userId);
          message.success(`User ID: ${userId} has been ${isVerified ? "approved" : "rejected"}`);
        },
        onCancel: () => {
          message.info("Action canceled.");
        }
      });
    }
  };

  const columns = [
    {
      title: "ID",
      dataIndex: "id",
      key: "id"
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
      key: "role"
    },
    {
      title: "Created At",
      dataIndex: "created_at",
      key: "created_at"
    },
    {
      title: "Description",
      dataIndex: "description",
      key: "description"
    },
    {
      title: "Status",
      dataIndex: "status",
      key: "status",
      render: (status: boolean) => <span className={userStatusColor(status)}>{status ? "Active" : "Inactive"}</span>
    },
    {
      title: "Action",
      key: "action",
      render: (_: unknown, record: User) => (
        <div className="flex items-center justify-between" style={{ minHeight: "48px" }}>
          {!record.is_verified &&
            !updatedUsers.includes(record.id) && ( // Check if the action has been taken
              <>
                <button
                  onClick={() => handleApprove(record.id, true)}
                  className="rounded-md bg-blue-500 px-4 py-2 text-white"
                  style={{ width: "100px", marginRight: "4px" }} // Adjust margin for closeness
                >
                  Approve
                </button>
                <button onClick={() => handleApprove(record.id, false)} className="rounded-md bg-red-500 px-4 py-2 text-white" style={{ width: "70px" }}>
                  Reject
                </button>
              </>
            )}
          {updatedUsers.includes(record.id) && <span className="text-green-500"></span>} {/* Show completed status */}
        </div>
      )
    }
  ];

  return (
    <div className="-mt-3 mb-64 p-4">
      <Table<User>
        className="shadow-lg"
        columns={columns}
        dataSource={filteredUsers.map((user) => ({
          ...user,
          dob: new Date(user.dob) // Ensure dob is formatted correctly if used elsewhere
        }))}
        rowKey="id"
        pagination={{ pageSize: 10 }}
      />
    </div>
  );
};

export default ViewRequestAccount;
