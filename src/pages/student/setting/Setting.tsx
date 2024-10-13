import StudentInformation from "../../../components/student/setting/StudentInformation";
import ChangePassword from "../../../components/student/setting/ChangePassword";
import { Tabs } from "antd";

const Setting = () => {
  const items = [
    {
      label: "Information",
      key: "1",
      children: <StudentInformation />,
    },
    {
      label: "Change Password",
      key: "2",
      children: <ChangePassword visible={true} currentPassword="" />,
    },
  ];

  return (
    <div className="min-h-screen bg-gray-100 p-5 md:p-10">
      <Tabs defaultActiveKey="1" items={items} />
    </div>
  );
};

export default Setting;
