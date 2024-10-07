import usersData from '../../data/users.json' // Adjust the path as necessary
import { User } from '../../models/User'
import { Typography, Descriptions, Button } from 'antd'

const { Title } = Typography

const AdminInfo = () => {
  // Find the admin user directly from the imported data
  const adminUser = usersData.users.find((user: User) => user.role === 'admin')

  if (!adminUser) {
    return <div className="text-center text-red-500">No admin user found.</div>
  }

  return (
    <div className="min-h-screen bg-gray-100 p-5 md:p-10">
      <div className="flex-col md:flex-row justify-between items-center">
        <Title className="text-center">Admin Information</Title>
        <Descriptions bordered column={1} className="mt-4 ">
          <Descriptions.Item label="Email" className="text-sm md:text-base">{adminUser.email}</Descriptions.Item>
          <Descriptions.Item label="Name" className="text-sm md:text-base">{adminUser.name}</Descriptions.Item>
          <Descriptions.Item label="Role" className="text-sm md:text-base">{adminUser.role}</Descriptions.Item>
          <Descriptions.Item label="Status" className="text-sm md:text-base">{adminUser.status ? 'Active' : 'Inactive'}</Descriptions.Item>
          <Descriptions.Item label="Description" className="text-sm md:text-base">{adminUser.description}</Descriptions.Item>
          <Descriptions.Item label="Phone Number" className="text-sm md:text-base">{adminUser.phone_number}</Descriptions.Item>
          <Descriptions.Item label="Date of Birth" className="text-sm md:text-base">{adminUser.dob}</Descriptions.Item>
          <Descriptions.Item label="Verified" className="text-sm md:text-base">{adminUser.is_verified ? 'Yes' : 'No'}</Descriptions.Item>
          <Descriptions.Item label="Created At" className="text-sm md:text-base">{new Date(adminUser.created_at).toLocaleString()}</Descriptions.Item>
          <Descriptions.Item label="Updated At" className="text-sm md:text-base">{new Date(adminUser.updated_at).toLocaleString()}</Descriptions.Item>
        </Descriptions>
      </div>
      <Button type="primary" className="mt-4 md:mt-2 md:-ml-0">
        Edit
      </Button>
    </div>
  )
}

export default AdminInfo
