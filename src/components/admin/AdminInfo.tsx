import usersData from "../../data/users.json"; // Adjust the path as necessary
import { UserRole } from "../../models/User";
import { Typography, Descriptions, Button, Tabs } from "antd";
import { useNavigate } from "react-router-dom";
import ChangePasswordAdmin from "./ChangePasswordAdmin";
const { Title } = Typography;

const AdminInfo = () => {
  const navigate = useNavigate();
  const adminUser = usersData.users.find(
    (user) => user.role === UserRole.ADMIN
  );

  if (!adminUser) {
    return <div className="text-center text-red-500">No admin user found.</div>;
  }

  const handleEdit = () => {
    navigate(`/admin/edit-user/${adminUser.id}`);
  };

  return (
    <div className="min-h-screen bg-gray-100 p-5 md:p-10">
      <div className="flex-col md:flex-row justify-between items-center">
        <Title className="">Setting</Title>
        <Tabs defaultActiveKey="1" className="mt-4">
          <Tabs.TabPane tab="Information" key="1">
            <Descriptions bordered column={1} className="mt-4">
              <Descriptions.Item label="Email" className="text-sm md:text-base">
                {adminUser.email}
              </Descriptions.Item>
              <Descriptions.Item label="Name" className="text-sm md:text-base">
                {adminUser.name}
              </Descriptions.Item>
              <Descriptions.Item label="Role" className="text-sm md:text-base">
                {adminUser.role}
              </Descriptions.Item>
              <Descriptions.Item
                label="Status"
                className="text-sm md:text-base"
              >
                {adminUser.status ? "Active" : "Inactive"}
              </Descriptions.Item>
              <Descriptions.Item
                label="Description"
                className="text-sm md:text-base"
              >
                {adminUser.description}
              </Descriptions.Item>
              <Descriptions.Item
                label="Phone Number"
                className="text-sm md:text-base"
              >
                {adminUser.phone_number}
              </Descriptions.Item>
              <Descriptions.Item
                label="Date of Birth"
                className="text-sm md:text-base"
              >
                {adminUser.dob}
              </Descriptions.Item>
              <Descriptions.Item
                label="Verified"
                className="text-sm md:text-base"
              >
                {adminUser.is_verified ? "Yes" : "No"}
              </Descriptions.Item>
              <Descriptions.Item
                label="Created At"
                className="text-sm md:text-base"
              >
                {new Date(adminUser.created_at).toLocaleString()}
              </Descriptions.Item>
              <Descriptions.Item
                label="Updated At"
                className="text-sm md:text-base"
              >
                {new Date(adminUser.updated_at).toLocaleString()}
              </Descriptions.Item>
            </Descriptions>
            <Button
              type="primary"
              onClick={handleEdit}
              className="mt-4 md:mt-2 md:-ml-0"
            >
              Edit Profile
            </Button>
          </Tabs.TabPane>
          <Tabs.TabPane tab="Change Password" key="2">
            <ChangePasswordAdmin 
              visible={true} 
              currentPassword={adminUser.password} 
            />
          </Tabs.TabPane>
        </Tabs>
      </div>
    </div>
  );
};

export default AdminInfo;
