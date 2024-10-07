import React from 'react';
import { Layout } from 'antd';
import AdminNavbar from './AdminNavbar';
import { Outlet } from 'react-router-dom';

const { Content } = Layout;

const Admin: React.FC = () => {
  return (
    <Layout style={{ minHeight: '100vh' }}>
      <AdminNavbar />
      <Layout>
        <Content className="p-6 bg-gray-100">

          <header className="mb-4 p-6 bg-gradient-to-r from-indigo-600 to-indigo-800 rounded-lg shadow-lg flex justify-between items-center">
            {/* <h2 className="text-2xl font-bold text-white">Dashboard</h2> */}
            <div className="text-white">
              Welcome, <span className="font-semibold">Admin</span>
            </div>
          </header>

          <section>
            <Outlet />
          </section>
        </Content>
      </Layout>
    </Layout>
  );
};

export default Admin;
