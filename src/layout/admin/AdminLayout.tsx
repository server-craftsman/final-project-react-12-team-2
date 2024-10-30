import React, { lazy, useEffect } from "react";
import { Outlet, useNavigate } from "react-router-dom";
import { Layout } from "antd";
import { Avatar, Dropdown } from "antd";
import { UserOutlined, LogoutOutlined, DownOutlined, HomeOutlined } from "@ant-design/icons";
const AdminNavbar = lazy(() => import("./AdminNavbar"));
const StudentFooter = lazy(() => import("../main-layout/MainFooter"));
const { Content } = Layout;
import { AuthService } from "../../services/authentication/auth.service";
import { useAuth } from "../../contexts/AuthContext";

const Admin: React.FC = () => {
  const { logout, token, userInfo, setUserInfo } = useAuth();
  const navigate = useNavigate();
  useEffect(() => {
    const fetchUserInfo = async () => {
      if (!token) {
        logout();
        return;
      }

      try {
        const response = await AuthService.getUserRole({ token });
        if (response.data?.data) {
          setUserInfo(response.data.data);
        } else {
          logout();
        }
      } catch (error) {
        console.error("Failed to fetch user info:", error);
        logout();
      }
    };

    if (!userInfo && token) {
      fetchUserInfo();
    }
  }, [token, userInfo, setUserInfo, logout]);

  const handleLogout = async () => {
    try {
      await AuthService.logout();
      logout();
    } catch (error) {
      console.error("Logout failed:", error);
      logout();
    }
  };

  return (
    <Layout style={{ minHeight: "100vh", display: "flex", flexDirection: "column" }}>
      <Layout style={{ display: "flex", flexDirection: "row" }}>
        <AdminNavbar />
        <Content className="bg-gray-100 p-6 flex-1">
          <header className="mb-4 rounded-lg bg-gradient-tone p-6 shadow-lg border-b border-indigo-700">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-4">
                <Avatar size={48} src={userInfo?.avatar_url} icon={!userInfo?.avatar_url && <UserOutlined />} />
                <div className="text-white">
                  <h2 className="text-xl font-bold">Welcome, {userInfo?.name || "Admin"}</h2>
                </div>
              </div>

              <Dropdown
                menu={{
                  items: [
                    {
                      key: "profile", 
                      label: (
                        <div className="p-2">
                          <div className="mb-2 flex items-center space-x-3">
                            <Avatar size={40} src={userInfo?.avatar_url} icon={!userInfo?.avatar_url && <UserOutlined />} />
                            <div>
                              <div className="font-semibold">{userInfo?.name || "Admin"}</div>
                              <div className="text-sm text-gray-500">{userInfo?.email}</div>
                            </div>
                          </div>
                          <div className="mt-2 border-t pt-2" />
                        </div>
                      )
                    },
                    {
                      key: "home", 
                      icon: <HomeOutlined />,
                      label: "Home",
                      onClick: () => navigate('/')
                    },
                    {
                      key: "logout",
                      icon: <LogoutOutlined />,
                      label: "Logout", 
                      onClick: handleLogout
                    }
                  ]
                }}
                placement="bottomRight"
                arrow
              >
                <button className="flex items-center space-x-2 rounded-lg bg-gradient-tone px-4 py-2 text-white transition-all hover:bg-[#413eff]">
                  <span>Account</span>
                  <DownOutlined />
                </button>
              </Dropdown>
            </div>
          </header>

          <section>
            <Outlet />
          </section>
        </Content>
      </Layout>
      <StudentFooter />
    </Layout>
  );
};

export default Admin;
