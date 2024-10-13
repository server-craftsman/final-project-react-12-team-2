import { Layout } from "antd";
import { Outlet } from "react-router-dom";
import StudentDashboardNavbar from "./StudentDashboardNavbar";
import { Content } from "antd/es/layout/layout";
import StudentFooter from "../main-layout/MainFooter";
const StudentDashboard = () => {
  return (
    <Layout style={{ minHeight: "100vh" }}>
      <StudentDashboardNavbar />
      <Layout>
        <Content className="bg-gray-100 p-6">
          <header className="mb-4 flex items-center justify-between rounded-lg bg-gradient-to-r from-indigo-600 to-indigo-800 p-6 shadow-lg">
            {/* <h2 className="text-2xl font-bold text-white">Dashboard</h2> */}
            <div className="text-white">
              Welcome to EduLearner,{" "}
              <span className="font-semibold">Student</span>
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

export default StudentDashboard;
