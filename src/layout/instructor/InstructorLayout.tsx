import React, { lazy } from "react";
import { Layout } from "antd";
import { Outlet } from "react-router-dom";
const InstructorNavbar = lazy(() => import("./InstructorNavbar"));
const StudentFooter = lazy(() => import("../main-layout/MainFooter"));
const { Content } = Layout;

const Instructor: React.FC = () => {
  return (
    <Layout style={{ minHeight: "100vh" }}>
      <InstructorNavbar />
      <Layout>
        <Content className="bg-gray-100 p-6">
          <header className="mb-4 flex items-center justify-between rounded-lg bg-gradient-to-r from-indigo-600 to-indigo-800 p-6 shadow-lg">
            {/* <h2 className="text-2xl font-bold text-white">Dashboard</h2> */}
            <div className="text-white">
              Welcome, <span className="font-semibold">Instructor</span>
            </div>
          </header>

          <section>
            <Outlet />
          </section>
        </Content>
        <StudentFooter />
      </Layout>
    </Layout>
  );
};

export default Instructor;
