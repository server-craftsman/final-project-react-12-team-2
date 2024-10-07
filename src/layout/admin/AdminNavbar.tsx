import React, { useState } from 'react';
import { Layout, Menu, Badge } from 'antd';
import { UserOutlined, BellOutlined, DashboardOutlined, ProjectOutlined, MessageOutlined } from '@ant-design/icons';
import { Link } from 'react-router-dom';
const { Sider } = Layout;
const AdminLayout: React.FC = () => {
    const [collapsed, setCollapsed] = useState(false);

  return (
    <>
    <Layout className="min-h-screen">
      <Sider 
        collapsible 
        collapsed={collapsed} 
        onCollapse={(value) => setCollapsed(value)} 
        className="bg-gradient-to-r from-[#02005dc6] to-[#1a237e] min-h-screen"
      >
        <Menu theme="dark" mode="vertical" defaultSelectedKeys={['1']}>
          <Menu.Item key="1" icon={<DashboardOutlined />}>
            <Link to="/admin/dashboard">Dashboard</Link>
          </Menu.Item>
          <Menu.Item key="2" icon={<ProjectOutlined />}>
            <Link to="/admin/projects">Projects</Link>
          </Menu.Item>
          <Menu.Item key="3" icon={<UserOutlined />}>
            <Link to="/admin/task-list">Task list</Link>
          </Menu.Item>
          <Menu.Item key="4" icon={<BellOutlined />}>
            <Badge count={2} className='text-white'>
              <Link to="/admin/notifications">Notifications</Link>
            </Badge>
          </Menu.Item>
          <Menu.Item key="5" icon={<MessageOutlined />}>
            <Link to="/admin/chat">Chat</Link>
          </Menu.Item>
        </Menu>
      </Sider>
    </Layout>
    </>
  );
};

export default AdminLayout;
