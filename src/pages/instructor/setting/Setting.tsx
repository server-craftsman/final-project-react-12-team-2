import React from "react";
import { Tabs } from "antd";
import InstructorInfo from "../../../components/instructor/setting/InstructorInfo";
import ChangePasswordInstructor from "../../../components/instructor/setting/ChangePasswordInstructor";
import { storage } from "../../../utils";

const Setting: React.FC = () => {
  const userInfo = JSON.parse(storage.getItemInLocalStorage("userInfo") || "{}");
  const googleId = userInfo?.google_id;
  const items = [
    {
      label: "Instructor Info",
      key: "1",
      children: <InstructorInfo />
    }
  ];

  if (!googleId) {
    items.push({
      label: "Change Password",
      key: "2",
      children: <ChangePasswordInstructor />
    });
  }

  return <Tabs defaultActiveKey="1" items={items} />;
};

export default Setting;
