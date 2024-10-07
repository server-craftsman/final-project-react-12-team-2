import React, { useState } from 'react';
import { Layout, Menu, Badge } from 'antd';
import { UserOutlined, BellOutlined, DashboardOutlined, ProjectOutlined, MessageOutlined } from '@ant-design/icons';
import { Link } from 'react-router-dom';
const { Sider } = Layout;

const AdminNavbar: React.FC = () => {
    const [collapsed, setCollapsed] = useState(false);

  const menuItems = [
    {
      key: '1',
      icon: <DashboardOutlined />,
      label: <Link to="/admin/dashboard">Dashboard</Link>,
    },
    {
      key: '2',
      icon: <ProjectOutlined />,
      label: <Link to="/admin/courses">Courses</Link>,
    },
    {
      key: '3',
      icon: <UserOutlined />,
      label: <Link to="/admin/users">Users</Link>,
    },
    {
      key: '4',
      icon: <BellOutlined />,
      // label: (
      //   <Badge count={2} className='text-[#a6abb0]'>
      //     <Link to="/admin/orders">Orders</Link>
      //   </Badge>
      // ),
      label: <Link to="/admin/orders">Orders</Link>,
    },
    {
      key: '5',
      icon: <MessageOutlined />,
      label: <Link to="/admin/chat">Chat</Link>,
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

export default AdminNavbar;
