import useResponsiveCollapse from '../../hooks/useResponsiveCollapse';
import { Layout, Menu } from 'antd';
import {BellOutlined, DashboardOutlined, FileTextOutlined, SettingOutlined} from '@ant-design/icons';
import { Link } from 'react-router-dom';
const { Sider } = Layout;
import logo from "../../assets/logo.jpg"

const StudentDashboardNavbar = () => {
    const [collapsed, setCollapsed] = useResponsiveCollapse();

    const menuItems = [
      {
        key: '1',
        icon: <DashboardOutlined />,
        label: <Link to="/dashboard-student">Dashboard</Link>,
      },
      {
        key: '2',
        icon: <BellOutlined />,
        label: <Link to="student-orders">Orders</Link>,
      },
      {
        key: '3',
        icon: <FileTextOutlined />,
        label: <Link to="student-subscription">Subscription</Link>,
      },
      {
        key: '4',
        icon: <SettingOutlined />,
        label: <Link to="student-setting">Setting</Link>,
      },
    ];
  
    return (
      <Sider 
        collapsible 
        collapsed={collapsed} 
        onCollapse={(value) => setCollapsed(value)} 
        className="bg-gradient-to-r from-[#02005dc6] to-[#1a237e] min-h-screen"
        breakpoint="md"
        onBreakpoint={(broken) => {
            setCollapsed(broken);
        }}
      >
        <Link to="/">
          <div className="logo p-4 flex items-center space-x-4">
            <img src={logo} alt="logo" className="w-12 h-12 rounded-full border-2 border-white" />
            {!collapsed && <h1 className="text-white text-xl font-bold">Student Panel</h1>}
          </div>
        </Link>
        <Menu theme="dark" mode="vertical" items={menuItems} />
      </Sider>
    );
  };

export default StudentDashboardNavbar
