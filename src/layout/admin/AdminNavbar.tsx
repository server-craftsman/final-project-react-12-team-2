import React, { useState } from 'react';
import { Layout, Menu } from 'antd';
import { BankOutlined, TeamOutlined, BellOutlined, DashboardOutlined, UserOutlined, FileTextOutlined, BookOutlined } from '@ant-design/icons';
import { Link } from 'react-router-dom';
const { Sider } = Layout;

const AdminNavbar: React.FC = () => {
    const [collapsed, setCollapsed] = useState(false);

  const menuItems = [
    {
      key: '1',
      icon: <DashboardOutlined />,
      label: <Link to="/admin">Dashboard</Link>,
    },
    {
      key: '2',
      icon: <UserOutlined />,
      label: <Link to="/admin/admininfo">Admin Info</Link>,
    },
    {
      key: '3',
      icon: <TeamOutlined />,
      label: <Link to="/admin/manageuser">User Management</Link>,
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
      icon: <FileTextOutlined />,
      label: <Link to="/admin/courses">Course Management</Link>,
    },
    {
      key: '6',
      icon: <BookOutlined />,
      label: <Link to="/admin/categories">Category Management</Link>,
    },
    {
      key: '7',
      icon: <BankOutlined />,
      label: <Link to="/admin/payout">Payout Management</Link>,
    }
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
