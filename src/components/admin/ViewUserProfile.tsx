import React from 'react'
import { Table } from 'antd'
import usersData from '../../data/users.json' // Adjust the path as necessary
import { User } from '../../models/User'

const ViewUserProfile = () => {
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
  ]

  return (
    <div className="p-4">
      <Table<User>
        className="shadow-lg"
        columns={columns}
        dataSource={usersData.users}
        rowKey="id"
        pagination={{ pageSize: 10 }}
      />
    </div>
  )
}

export default ViewUserProfile
