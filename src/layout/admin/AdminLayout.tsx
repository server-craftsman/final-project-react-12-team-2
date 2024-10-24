import React, { lazy, Suspense } from "react";
import { Outlet } from "react-router-dom";
import { Layout } from "antd";
const AdminNavbar = lazy(() => import("./AdminNavbar"));
const StudentFooter = lazy(() => import("../main-layout/MainFooter"));
const Loading = lazy(() => import("../../app/Loading"));
const { Content } = Layout;

const Admin: React.FC = () => {
  return (
    <Layout style={{ minHeight: "100vh" }}>
      <AdminNavbar />
      <Layout>
        <Content className="bg-gray-100 p-6">
          <header className="mb-4 flex items-center justify-between rounded-lg bg-gradient-to-r from-indigo-600 to-indigo-800 p-6 shadow-lg">
            {/* <h2 className="text-2xl font-bold text-white">Dashboard</h2> */}
            <div className="text-white">
              Welcome, <span className="font-semibold">Admin</span>
            </div>
          </header>

          <section>
            <Suspense fallback={<Loading />}>
              <Outlet />
            </Suspense>
          </section>
        </Content>
        <StudentFooter />
      </Layout>
    </Layout>
  );
};

export default Admin;
