import AdminInfo from "../../../components/admin/setting/AdminInfo";
import { Typography, Tabs } from "antd";
// import usersData from "../../../data/users.json"; // Adjust the path as necessary
// import { UserRole } from "../../../models/prototype/User";
import ChangePasswordAdmin from "../../../components/admin/setting/ChangePasswordAdmin";

const { Title } = Typography;

const Profile = () => {
  // const adminUser = usersData.users.find((user) => user.role === UserRole.admin);

  const items = [
    {
      label: "Information",
      key: "1",
      children: <AdminInfo />
    },
    {
      label: "Change Password",
      key: "2",
      children: <ChangePasswordAdmin visible={true} />
    }
  ];

  return (
    <div className="min-h-screen bg-gray-100 p-5 md:p-10">
      <div className="flex-col items-center justify-between md:flex-row">
        <Title className="">Setting</Title>
        <Tabs defaultActiveKey="1" className="mt-4" items={items} />
      </div>
    </div>
  );
};

export default Profile;
