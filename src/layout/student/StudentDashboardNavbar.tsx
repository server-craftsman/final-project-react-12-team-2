import useResponsiveCollapse from "../../hooks/useResponsiveCollapse";
import { BellOutlined, DashboardOutlined, FileTextOutlined, SettingOutlined } from "@ant-design/icons";
import { Link } from "react-router-dom";
import logo1 from "../../assets/logo1.jpg";
import { useState } from "react";

const StudentDashboardNavbar = () => {
  const [collapsed, setCollapsed] = useState(false);
  const [autoCollapsed] = useResponsiveCollapse();

  const isCollapsed = collapsed || autoCollapsed;

  const menuItems = [
    {
      key: "1",
      icon: <DashboardOutlined />,
      label: "Dashboard",
      path: "/dashboard-student"
    },
    {
      key: "2",
      icon: <BellOutlined />,
      label: "Orders",
      path: "/dashboard-student/student-orders"
    },
    {
      key: "3",
      icon: <FileTextOutlined />,
      label: "Subscription",
      path: "/dashboard-student/student-subscription"
    },
    {
      key: "4",
      icon: <SettingOutlined />,
      label: "Setting",
      path: "/dashboard-student/student-setting"
    }
  ];

  return (
    <nav className={`transition-all duration-300 ${isCollapsed ? "w-20" : "w-64"} bg-gradient-tone min-h-screen shadow-2xl`}>
      <div className="flex items-center justify-between border-b border-indigo-400/30 p-4 backdrop-blur-sm">
        {!isCollapsed && (
          <Link to="/" className="group flex items-center space-x-4">
            <div className="relative">
              <img src={logo1} alt="logo" className="h-12 w-12 rounded-full border-2 border-white/80 shadow-lg transition-transform duration-300 group-hover:scale-105" />
              <div className="absolute inset-0 rounded-full bg-gradient-to-br from-purple-500/20 to-pink-500/20 opacity-0 transition-opacity duration-300 group-hover:opacity-100"></div>
            </div>
            <h1 className="text-xl font-bold text-white/90 transition-colors duration-300 group-hover:text-white">Student Panel</h1>
          </Link>
        )}
        {isCollapsed && (
          <Link to="/" className="group mx-auto">
            <div className="relative">
              <img src={logo1} alt="logo" className="h-12 w-12 rounded-full border-2 border-white/80 shadow-lg transition-transform duration-300 group-hover:scale-105" />
              <div className="absolute inset-0 rounded-full bg-gradient-to-br from-purple-500/20 to-pink-500/20 opacity-0 transition-opacity duration-300 group-hover:opacity-100"></div>
            </div>
          </Link>
        )}
      </div>

      <div className="mt-6 flex flex-col space-y-2 px-4">
        {menuItems.map((item) => (
          <Link key={item.key} to={item.path} className="group flex items-center space-x-3 rounded-lg p-3 text-white/90 transition-all duration-300 hover:bg-white/10 hover:text-white hover:shadow-lg" title={isCollapsed ? item.label : ""}>
            <span className="transition-transform duration-300 group-hover:scale-110">{item.icon}</span>
            {!isCollapsed && <span className="font-medium">{item.label}</span>}
          </Link>
        ))}
      </div>
      <div className="mt-6 flex flex-col space-y-2 px-4">
        {!autoCollapsed && (
          <button onClick={() => setCollapsed(!collapsed)} className="rounded-full p-2 text-white/80 transition-all duration-300 hover:bg-white/10 hover:text-white hover:shadow-lg">
            {isCollapsed ? (
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-6">
                <path strokeLinecap="round" strokeLinejoin="round" d="m8.25 4.5 7.5 7.5-7.5 7.5" />
              </svg>
            ) : (
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-6">
                <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 19.5 8.25 12l7.5-7.5" />
              </svg>
            )}
          </button>
        )}
      </div>
    </nav>
  );
};

export default StudentDashboardNavbar;
