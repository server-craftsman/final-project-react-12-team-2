import React from "react";
import { Tabs } from "antd";
import InstructorInfo from "../../../components/instructor/setting/InstructorInfo";
import ChangePasswordInstructor from "../../../components/instructor/setting/ChangePasswordInstructor";

const Setting: React.FC = () => {
  const items = [
    {
      label: "Instructor Info",
      key: "1",
      children: <InstructorInfo />,
    },
    {
      label: "Change Password",
      key: "2",
      children: <ChangePasswordInstructor />,
    },
  ];

  return <Tabs defaultActiveKey="1" items={items} />;
};

export default Setting;
