import { Table } from 'antd';
import { useNavigate } from 'react-router-dom';
import usersData from '../../data/users.json'; // Adjust the path as necessary
import { User } from '../../models/User';
import { Key } from 'react';

const ViewUserProfile = ({ searchQuery }: { searchQuery: string }) => {
  const navigate = useNavigate();

  const handleViewDetails = (userId: string) => {
    // Navigate to the user detail page
    navigate(`/admin/view-user/${userId}`);
  };

  const filteredUsers = usersData.users.filter((user) =>
    (user.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    user.email.toLowerCase().includes(searchQuery.toLowerCase())));

  const rolesToInclude = ['instructor', 'admin', 'student'];
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
      filters: rolesToInclude.map(role => ({ text: role.charAt(0).toUpperCase() + role.slice(1), value: role })),
      onFilter: (value: boolean | Key, record: User) => {
        return record.role === value; // Adjust 'someProperty' to match your data structure
      },
    },
    {
      title: 'Status',
      dataIndex: 'status',
      key: 'status',
      filters: [
        { text: 'Active', value: true },
        { text: 'Inactive', value: false },
      ],
      onFilter: (value: boolean | Key, record: User) => {
        if (typeof value === 'boolean') {
          return record.status === value;
        }
      return false; // or some other logic
      },
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
      render: (_: any, record: User) => (
        <div>
          <button onClick={() => handleViewDetails(record.id)} className='bg-gradient-tone text-white px-4 py-2 rounded-md'>View Details</button>
        </div>
      ),
    },
  ]

  return (
    <div className="p-4">
      <Table<User>
        className="shadow-lg"
        columns={columns}
        dataSource={filteredUsers}
        rowKey="id"
        pagination={{ pageSize: 10 }}
      />
    </div>
  )
}

export default ViewUserProfile;
