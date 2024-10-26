import { useEffect } from "react";
import { Descriptions, Button } from "antd";
import { EditOutlined } from "@ant-design/icons";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../../contexts/AuthContext";
import parse from "html-react-parser";
import { helpers } from "../../../utils";
import { ROUTER_URL } from "../../../const/router.path";

const AdminInfo: React.FC = () => {
  const navigate = useNavigate();
  const { getCurrentUser, userInfo } = useAuth();

  useEffect(() => {
    getCurrentUser();
  }, []);

  const handleEdit = () => {
    navigate(ROUTER_URL.ADMIN.EDIT_USER.replace(":id", userInfo?._id as string));
  };

  if (!userInfo) {
    return (
      <div className="flex h-screen items-center justify-center">
        <div className="font-serif text-2xl italic text-[#1a237e]">No admin user found.</div>
      </div>
    );
  } else {
    return (
      <div className="max-w-10xl animate-fade-in mx-auto rounded-xl bg-white p-8 shadow-2xl">
        <div className="mb-8 flex flex-col items-center">
          {userInfo.avatar_url ? (
            <img src={userInfo.avatar_url} alt="User avatar" className="h-40 w-40 rounded-full border-4 border-[#1a237e] object-cover shadow-lg transition-transform duration-300 hover:scale-105" />
          ) : (
            <div className="flex h-40 w-40 items-center justify-center rounded-full border-4 border-[#1a237e] bg-gray-200">
              <span className="text-2xl text-gray-500">No Avatar</span>
            </div>
          )}
          <h2 className="mt-4 text-2xl font-bold text-[#1a237e]">{userInfo.name}</h2>
          <p className="italic text-gray-600">{userInfo.role}</p>
        </div>

        <Descriptions
          bordered
          column={1}
          className="mt-4"
          labelStyle={{
            backgroundColor: "#f0f2ff",
            fontFamily: "sans-serif",
            fontSize: "1rem",
            padding: "0.75rem",
            color: "#666"
          }}
          contentStyle={{
            fontFamily: "sans-serif",
            fontSize: "1rem",
            padding: "0.75rem"
          }}
        >
          <Descriptions.Item label="Email" className="text-base">
            {userInfo.email}
          </Descriptions.Item>
          <Descriptions.Item label="Description" className="text-base">
            <div className="prose max-w-none">{userInfo.description ? parse(userInfo.description) : ""}</div>
          </Descriptions.Item>
          <Descriptions.Item label="Phone Number" className="text-base">
            {helpers.formatPhoneNumber(userInfo.phone_number as string)}
          </Descriptions.Item>
          <Descriptions.Item label="Date of Birth" className="text-base">
            {userInfo.dob ? helpers.formatDate(new Date(userInfo.dob)) : "-"}
          </Descriptions.Item>
          <Descriptions.Item label="Verified" className="text-base">
            <span className={userInfo.is_verified ? "text-green-600" : "text-red-600"}>{userInfo.is_verified ? "Yes" : "No"}</span>
          </Descriptions.Item>
          <Descriptions.Item label="Created At" className="text-base">
            {userInfo.created_at ? helpers.formatDate(new Date(userInfo.created_at)) : "-"}
          </Descriptions.Item>
          <Descriptions.Item label="Updated At" className="text-base">
            {userInfo.updated_at ? helpers.formatDate(new Date(userInfo.updated_at)) : "-"}
          </Descriptions.Item>
        </Descriptions>
        <div className="mt-6 flex justify-end">
          <Button type="primary" onClick={handleEdit} className="flex h-auto items-center gap-2 border-none bg-[#1a237e] px-8 py-4 text-lg transition-colors duration-300 hover:bg-[#0d1453]">
            <EditOutlined />
          </Button>
        </div>
      </div>
    );
  }
};

export default AdminInfo;
