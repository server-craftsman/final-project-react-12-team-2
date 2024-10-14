import React from "react";
import { Layout, Menu } from "antd";
import {
  BankOutlined,
  TeamOutlined,
  BellOutlined,
  DashboardOutlined,
  SettingOutlined,
  FileTextOutlined,
  BookOutlined,
} from "@ant-design/icons";
import { Link } from "react-router-dom";
import useResponsiveCollapse from "../../hooks/useResponsiveCollapse";
const { Sider } = Layout;
import logo from "../../assets/logo.jpg";

const AdminNavbar: React.FC = () => {
  const [collapsed, setCollapsed] = useResponsiveCollapse();

  const menuItems = [
    {
      key: "1",
      icon: <DashboardOutlined />,
      label: <Link to="/admin">Dashboard</Link>,
    },
    {
      key: "2",
      icon: <TeamOutlined />,
      label: <Link to="/admin/manage-user">User Management</Link>,
    },
    {
      key: "3",
      icon: <BellOutlined />,
      label: <Link to="/admin/orders">Orders</Link>,
    },
    {
      key: "4",
      icon: <FileTextOutlined />,
      label: <Link to="/admin/courses">Course Management</Link>,
    },
    {
      key: "5",
      icon: <BookOutlined />,
      label: <Link to="/admin/categories">Category Management</Link>,
    },
    {
      key: "6",
      icon: <BankOutlined />,
      label: <Link to="/admin/payout">Payout Management</Link>,
    },
    {
      key: "7",
      icon: <SettingOutlined />,
      label: <Link to="/admin/admin-info">Setting</Link>,
    },
    {
      key: "8",
      icon: <SettingOutlined />,
      label: <Link to="/admin/courses-log">Course Log</Link>,
    }
  ];

  return (
    <Sider
      collapsible
      collapsed={collapsed}
      onCollapse={(value) => setCollapsed(value)}
      className="min-h-screen bg-gradient-to-r from-[#02005dc6] to-[#1a237e]"
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
            <h1 className="text-xl font-bold text-white">Admin Panel</h1>
          )}
        </div>
      </Link>
      <Menu theme="dark" mode="vertical" items={menuItems} />
    </Sider>
  );
};

export default AdminNavbar;
