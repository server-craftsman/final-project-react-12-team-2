import { useState } from 'react';
import { Layout, Menu } from 'antd';
import {BellOutlined, DashboardOutlined, UserOutlined, FileTextOutlined} from '@ant-design/icons';
import { Link } from 'react-router-dom';
const { Sider } = Layout;

const StudentDashboardNavbar = () => {
    const [collapsed, setCollapsed] = useState(false);

    const menuItems = [
      {
        key: '1',
        icon: <DashboardOutlined />,
        label: <Link to="/dashboard-student">Dashboard</Link>,
      },
      {
        key: '2',
        icon: <UserOutlined />,
        label: <Link to="student-profile">Student Profle</Link>,
      },
      
      {
        key: '3',
        icon: <BellOutlined />,
        // label: (
        //   <Badge count={2} className='text-[#a6abb0]'>
        //     <Link to="/admin/orders">Orders</Link>
        //   </Badge>
        // ),
        label: <Link to="student-orders">Orders</Link>,
      },
      {
        key: '4',
        icon: <FileTextOutlined />,
        label: <Link to="student-subcription">Subcription</Link>,
      },
      
    ];
  
    return (
      <Sider 
        collapsible 
        collapsed={collapsed} 
        onCollapse={(value) => setCollapsed(value)} 
        className="bg-gradient-to-r from-[#02005dc6] to-[#1a237e] min-h-screen"
      >
        <div className="logo p-4">
          <h1 className="text-white text-xl font-bold">{collapsed ? 'Admin' : 'Admin Panel'}</h1>
        </div>
        <Menu theme="dark" mode="vertical" items={menuItems} />
      </Sider>
    );
  };

export default StudentDashboardNavbar