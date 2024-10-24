import { Table } from "antd";
import { useNavigate } from "react-router-dom";
import usersData from "../../../data/users.json"; // Adjust the path as necessary
import { User, UserRole } from "../../../models/prototype/User";
import { userStatusColor } from "../../../utils/userStatus";
import { userRoleColor } from "../../../utils/userRole";
interface ViewUserProfileProps {
  searchQuery: string;
  selectedRole: UserRole | null;
  selectedStatus: boolean | null;
}

const ViewUserProfile = ({
  searchQuery,
  selectedRole,
  selectedStatus,
}: ViewUserProfileProps) => {
  const navigate = useNavigate();

  const handleViewDetails = (userId: string) => {
    navigate(`/admin/view-user/${userId}`);
  };

  const filteredUsers = usersData.users
    .filter(
      (user) =>
        (user.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
          user.email.toLowerCase().includes(searchQuery.toLowerCase())) &&
        (selectedRole === null || user.role === selectedRole) &&
        (selectedStatus === null || user.status === selectedStatus),
    )
    .map((user) => ({
      ...user,
      role: user.role as UserRole,
    }));

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
        <span className={userRoleColor(role)}>{role}</span>
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
        dataSource={filteredUsers.map((user) => ({
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
