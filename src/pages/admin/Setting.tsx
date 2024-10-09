import AdminInfo from "../../components/admin/AdminInfo";
import { Typography, Tabs } from "antd";
import usersData from "../../data/users.json"; // Adjust the path as necessary
import { UserRole } from "../../models/User";
import ChangePasswordAdmin from "../../components/admin/ChangePasswordAdmin";

const { Title } = Typography;

const Profile = () => {
  const adminUser = usersData.users.find(
    (user) => user.role === UserRole.ADMIN
  );
  return (
    <div className="min-h-screen bg-gray-100 p-5 md:p-10">
      <div className="flex-col md:flex-row justify-between items-center">
        <Title className="">Setting</Title>
        <Tabs defaultActiveKey="1" className="mt-4">
          <Tabs.TabPane tab="Information" key="1">
            <AdminInfo />
          </Tabs.TabPane>

          <Tabs.TabPane tab="Change Password" key="2">
            <ChangePasswordAdmin
              visible={true}
              currentPassword={adminUser ? adminUser.password : ""}
            />
          </Tabs.TabPane>
        </Tabs>
      </div>
    </div>
  );
};

export default Profile;
