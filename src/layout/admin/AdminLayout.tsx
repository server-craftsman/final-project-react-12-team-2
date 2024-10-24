import React, { lazy, useEffect } from "react";
import { Outlet } from "react-router-dom";
import { Layout } from "antd";
import { Avatar, Dropdown } from "antd";
import { UserOutlined, LogoutOutlined, DownOutlined } from "@ant-design/icons";
const AdminNavbar = lazy(() => import("./AdminNavbar"));
const StudentFooter = lazy(() => import("../main-layout/MainFooter"));
const { Content } = Layout;
import { AuthService } from "../../services/authentication/auth.service";
import { useAuth } from "../../contexts/AuthContext";

const Admin: React.FC = () => {
  const { logout, token, userInfo, setUserInfo } = useAuth();

  useEffect(() => {
    const fetchUserInfo = async () => {
      if (!token) {
        logout();
        return;
      }
      
      try {
        const response = await AuthService.getUserRole(token);
        if (response.data?.data) {
          setUserInfo(response.data.data);
        } else {
          logout(); // No user data, force logout
        }
      } catch (error) {
        console.error('Failed to fetch user info:', error);
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
      console.error('Logout failed:', error);
      logout();
    }
  }

  return (
    <Layout style={{ minHeight: "100vh" }}>
      <AdminNavbar />
      <Layout>
        <Content className="bg-gray-100 p-6">
          <header className="mb-4 rounded-lg bg-gradient-to-r from-indigo-600 via-indigo-700 to-indigo-800 p-6 shadow-lg">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-4">
                <Avatar size={48} icon={<UserOutlined />} className="bg-indigo-400" />
                <div className="text-white">
                  <h2 className="text-xl font-bold">
                    Welcome, {userInfo?.name || 'Admin'}
                  </h2>
                </div>
              </div>
              
              <Dropdown menu={{ 
                items: [
                  {
                    key: 'profile',
                    label: (
                      <div className="p-2">
                        <div className="flex items-center space-x-3 mb-2">
                          <Avatar 
                            size={40} 
                            src={userInfo?.avatar_url}
                            icon={!userInfo?.avatar_url && <UserOutlined />}
                          />
                          <div>
                            <div className="font-semibold">{userInfo?.name || 'Admin'}</div>
                            <div className="text-gray-500 text-sm">{userInfo?.email}</div>
                          </div>
                        </div>
                        <div className="border-t pt-2 mt-2" />
                      </div>
                    ),
                  },
                  {
                    key: 'logout',
                    icon: <LogoutOutlined />,
                    label: 'Logout',
                    onClick: handleLogout
                  }
                ]
              }} placement="bottomRight" arrow>
                <button className="flex items-center space-x-2 rounded-lg bg-indigo-500 px-4 py-2 text-white transition-all hover:bg-indigo-400">
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
        <StudentFooter />
      </Layout>
    </Layout>
  );
};

export default Admin;
