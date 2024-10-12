import React, { useState } from "react";
import { Layout, Menu } from "antd";
import {
  DashboardOutlined,
  UserOutlined,
  FileTextOutlined,
  StarOutlined,
  BellOutlined,
} from "@ant-design/icons";
import { Link } from "react-router-dom";
const { Sider } = Layout;
import logo from "../../assets/logo.jpg"

const InstructorNavbar: React.FC = () => {
  const [collapsed, setCollapsed] = useState(false);

  const menuItems = [
    {
      key: "1",
      icon: <DashboardOutlined />,
      label: <Link to="/instructor/">Dashboard</Link>,
    },

    {
      key: "2",
      icon: <FileTextOutlined />,
      label: <Link to="/instructor/courses">My Courses</Link>,
    },
    {
      key: "3",
      icon: <FileTextOutlined />,
      label: <Link to="/instructor/payout">Manage Payout</Link>,
    },
    {
      key: "4",
      icon: <StarOutlined />,
      label: <Link to="/instructor/reviews">Reviews</Link>,
    },
    {
      key: "5",
      icon: <UserOutlined />,
      label: <Link to="/instructor/setting">Setting</Link>,
    },
    {
      key: "6",
      icon: <FileTextOutlined />,
      label: <Link to="/instructor/subscription">Subscription</Link>,
    },
    {
      key: "8",
      icon: <FileTextOutlined />,
      label: <Link to="/instructor/purchases">Purchases</Link>,
    },
    {
      key: "9",
      icon: <BellOutlined />,
      label: <Link to="/instructor/orders">Orders</Link>,
    },
  ];

  return (
    <Sider
      collapsible
      collapsed={collapsed}
      onCollapse={(value) => setCollapsed(value)}
      className="bg-gradient-to-r from-[#1565c0] to-[#0d47a1] min-h-screen"
    >
      <Link to="/">
          <div className="logo p-4 flex items-center space-x-4">
            <img src={logo} alt="logo" className="w-12 h-12 rounded-full border-2 border-white" />
            {!collapsed && <h1 className="text-white text-xl font-bold">Instructor Panel</h1>}
          </div>
        </Link>
      <Menu theme="dark" mode="vertical" items={menuItems} />
    </Sider>
  );
};

export default InstructorNavbar;
