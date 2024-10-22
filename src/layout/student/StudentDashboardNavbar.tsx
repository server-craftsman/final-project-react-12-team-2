import useResponsiveCollapse from "../../hooks/useResponsiveCollapse";
import { Layout, Menu } from "antd";
import {
  BellOutlined,
  DashboardOutlined,
  FileTextOutlined,
  SettingOutlined,
} from "@ant-design/icons";
import { Link } from "react-router-dom";
const { Sider } = Layout;
import logo1 from "../../assets/logo1.jpg";

const StudentDashboardNavbar = () => {
  const [collapsed, setCollapsed] = useResponsiveCollapse();

  const menuItems = [
    {
      key: "1",
      icon: <DashboardOutlined />,
      label: <Link to="/dashboard-student">Dashboard</Link>,
    },
    {
      key: "2",
      icon: <BellOutlined />,
      label: <Link to="student-orders">Orders</Link>,
    },
    {
      key: "3",
      icon: <FileTextOutlined />,
      label: <Link to="student-subscription">Subscription</Link>,
    },
    {
      key: "4",
      icon: <SettingOutlined />,
      label: <Link to="student-setting">Setting</Link>,
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
            <h1 className="text-xl font-bold text-white">Student Panel</h1>
          )}
        </div>
      </Link>
      <Menu theme="dark" mode="vertical" items={menuItems} />
    </Sider>
  );
};

export default StudentDashboardNavbar;
