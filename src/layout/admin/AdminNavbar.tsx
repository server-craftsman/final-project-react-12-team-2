import React from "react";
import { Layout, Menu } from "antd";
import {
  BankOutlined,
  TeamOutlined,
  DashboardOutlined,
  SettingOutlined,
  FileTextOutlined,
  BookOutlined,
  ShoppingCartOutlined,
  ClockCircleOutlined,
} from "@ant-design/icons";
import { Link } from "react-router-dom";
import useResponsiveCollapse from "../../hooks/useResponsiveCollapse";
const { Sider } = Layout;
import logo1 from "../../assets/logo1.jpg";

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
      icon: <ClockCircleOutlined />,
      label: <Link to="/admin/request-account">Request Account</Link>,
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
      icon: <BookOutlined />,
      label: <Link to="/admin/courses-log">Courses Log</Link>,
    },
    {
      key: "8",
      icon: <ShoppingCartOutlined />,
      label: <Link to="/admin/purchases-log">Purchases Log</Link>,
    },
    {
      key: "9",
      icon: <SettingOutlined />,
      label: <Link to="/admin/admin-info">Setting</Link>,
    },
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
            src={logo1}
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
