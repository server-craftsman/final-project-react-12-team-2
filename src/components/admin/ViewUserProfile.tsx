import { Table, Select } from 'antd';
import { useNavigate } from 'react-router-dom';
import usersData from '../../data/users.json'; // Adjust the path as necessary
import { User, UserRole } from '../../models/User';
import { useState } from 'react';

const ViewUserProfile = ({ searchQuery }: { searchQuery: string }) => {
  const navigate = useNavigate();
  const [selectedRole, setSelectedRole] = useState<UserRole | null>(null);
  const [selectedStatus, setSelectedStatus] = useState<boolean | null>(null);

  const handleViewDetails = (userId: string) => {
    // Navigate to the user detail page
    navigate(`/admin/view-user/${userId}`);
  };

  const filteredUsers = usersData.users
    .filter((user) =>
      (user.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      user.email.toLowerCase().includes(searchQuery.toLowerCase())) &&
      (selectedRole ? user.role === selectedRole : true) &&
      (selectedStatus !== null ? user.status === selectedStatus : true)
    )
    .map(user => ({
      ...user,
      role: user.role as UserRole
    }));

  const rolesToInclude = [UserRole.INSTRUCTOR, UserRole.ADMIN, UserRole.STUDENT];
  const columns = [
    {
      title: 'Name',
      dataIndex: 'name',
      key: 'name',
    },
    {
      title: 'Email',
      dataIndex: 'email',
      key: 'email',
    },
    {
      title: 'Role',
      dataIndex: 'role',
      key: 'role',
    },
    {
      title: 'Status',
      dataIndex: 'status',
      key: 'status',
      render: (status: boolean) => (status ? 'Active' : 'Inactive'),
    },
    {
      title: 'Balance',
      dataIndex: 'balance',
      key: 'balance',
    },
    {
      title: 'Action',
      key: 'action',
      render: (_: unknown, record: User) => (
        <div>
          <button onClick={() => handleViewDetails(record.id)} className='bg-gradient-tone text-white px-4 py-2 rounded-md'>View Details</button>
        </div>
      ),
    },
  ];

  return (
    <div className="p-4">
      <div className="mb-4">
        <Select
          placeholder="Select Role"
          onChange={(value) => setSelectedRole(value)}
          allowClear
          style={{ width: 120, marginRight: 10 }}
        >
          {rolesToInclude.map(role => (
            <Select.Option key={role} value={role}>
              {role.charAt(0).toUpperCase() + role.slice(1)}
            </Select.Option>
          ))}
        </Select>
        <Select
          placeholder="Select Status"
          onChange={(value) => setSelectedStatus(value)}
          allowClear
          style={{ width: 120 }}
        >
          <Select.Option value={true}>Active</Select.Option>
          <Select.Option value={false}>Inactive</Select.Option>
        </Select>
      </div>
      <Table<User>
        className="shadow-lg"
        columns={columns}
        dataSource={filteredUsers.map(user => ({...user, dob: new Date(user.dob)}))}
        rowKey="id"
        pagination={{ pageSize: 10 }}
      />
    </div>
  )
}

export default ViewUserProfile;
