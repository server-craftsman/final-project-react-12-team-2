import React from "react";
import { Layout, Menu } from "antd";
import {
  DashboardOutlined,
  UserOutlined,
  FileTextOutlined,
  StarOutlined,
  BellOutlined,
} from "@ant-design/icons";
import { Link } from "react-router-dom";
import useResponsiveCollapse from "../../hooks/useResponsiveCollapse";
const { Sider } = Layout;
import logo from "../../assets/logo.jpg";

const InstructorNavbar: React.FC = () => {
  const [collapsed, setCollapsed] = useResponsiveCollapse();

  const menuItems = [
    {
      key: "1",
      icon: <DashboardOutlined />,
      label: <Link to="/instructor/">Dashboard</Link>,
    },

    {
      key: "2",
      icon: <FileTextOutlined />,
      label: <Link to="/instructor/courses">Manage Courses</Link>,
    },
    {
      key: "3",
      icon: <FileTextOutlined />,
      label: <Link to="/instructor/purchases">Sales History</Link>,
    },
    {
      key: "4",
      icon: <FileTextOutlined />,
      label: <Link to="/instructor/payout">Manage Payout</Link>,
    },
    
    // {
    //   key: "5",
    //   icon: <BellOutlined />,
    //   label: <Link to="/instructor/orders">Orders</Link>,
    // },
    {
      key: "5",
      icon: <StarOutlined />,
      label: <Link to="/instructor/reviews">Reviews</Link>,
    },
    {
      key: "6",
      icon: <FileTextOutlined />,
      label: <Link to="/instructor/subscription">Subscription</Link>,
    },
    {
      key: "7",
      icon: <UserOutlined />,
      label: <Link to="/instructor/setting">Setting</Link>,
    },
  ];

  return (
    <Sider
      collapsible
      collapsed={collapsed}
      onCollapse={(value) => setCollapsed(value)}
      className="min-h-screen bg-gradient-to-r from-[#1565c0] to-[#0d47a1]"
      breakpoint="md"
      onBreakpoint={(broken) => {
        setCollapsed(broken);
      }}
    >
      <Link to="/">
        <div className="logo flex items-center space-x-4 p-4">
          <img
            src={logo}
            alt="logo"
            className="h-12 w-12 rounded-full border-2 border-white"
          />
          {!collapsed && (
            <h1 className="text-xl font-bold text-white">Instructor Panel</h1>
          )}
        </div>
      </Link>
      <Menu theme="dark" mode="vertical" items={menuItems} />
    </Sider>
  );
};

export default InstructorNavbar;
