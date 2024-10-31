import { useEffect } from "react";
import { Descriptions, Button } from "antd";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../../contexts/AuthContext";
import { helpers } from "../../../utils";
import parse from "html-react-parser";
import { ROUTER_URL } from "../../../const/router.path";
import { EditOutlined } from "@ant-design/icons";

const InstructorInfo = () => {
  const navigate = useNavigate();
  const { getCurrentUser, userInfo } = useAuth();

  useEffect(() => {
    getCurrentUser();
  }, []);

  const handleEdit = () => {
    navigate(ROUTER_URL.INSTRUCTOR.EDIT_USER.replace(":id", userInfo?._id as string));
  };

  if (!userInfo) {
    return (
      <div className="flex h-screen items-center justify-center">
        <div className="font-serif text-2xl italic text-[#1a237e]">No admin user found.</div>
      </div>
    );
  } else {
    return (
      <div className="max-w-10xl animate-fade-in mx-auto rounded-2xl bg-white p-12 shadow-[0_20px_50px_rgba(8,_112,_184,_0.7)]">
        <div className="mb-12 flex flex-col items-center">
          <div className="flex flex-col md:flex-row items-center gap-12">
            <div className="relative group">
              {userInfo.avatar_url ? (
                <div className="relative mt-6">
                  <div className="absolute -inset-0.5 rounded-full bg-gradient-tone opacity-75 blur"></div>
                  <img 
                    src={userInfo.avatar_url} 
                    alt="User avatar" 
                    className="relative h-52 w-52 rounded-full border-4 border-white object-cover shadow-2xl transition-all duration-300 group-hover:scale-105" 
                  />
                </div>
              ) : (
                <div className="relative">
                  <div className="absolute -inset-0.5 rounded-full bg-gradient-tone opacity-75 blur"></div>
                  <div className="relative flex h-52 w-52 items-center justify-center rounded-full border-4 border-white bg-gradient-tone">
                    <span className="text-3xl font-medium text-white drop-shadow-lg">No Avatar</span>
                  </div>
                </div>
              )}
              {/* <div className="absolute inset-0 rounded-full bg-gradient-to-br from-purple-500/30 to-pink-500/30 opacity-0 transition-opacity duration-500 group-hover:opacity-100"></div> */}
            </div>

            {userInfo.video_url && (
              <div className="relative group">
                <h1 className="text-3xl font-bold bg-gradient-tone bg-clip-text text-transparent mb-4">Video Introduction</h1>
                <div className="relative">
                  <div className="absolute -inset-1 rounded-2xl bg-gradient-tone opacity-75 blur"></div>
                  <video 
                    controls
                    playsInline
                    preload="metadata"
                    className="relative h-52 w-96 rounded-xl border-4 border-white object-cover shadow-2xl transition-all duration-300 group-hover:scale-[1.02]"
                    src={userInfo.video_url}
                  >
                    Your browser does not support the video tag.
                  </video>
                </div>
              </div>
            )}
          </div>

          <div className="mt-8 text-center">
            <h2 className="text-4xl font-bold bg-gradient-tone bg-clip-text text-transparent mb-3">{userInfo.name}</h2>
            <p className="text-xl italic text-gray-600 font-medium tracking-wide">{userInfo.role}</p>
          </div>
        </div>

        <Descriptions
          bordered
          column={1}
          className="mt-8"
          labelStyle={{
            background: "linear-gradient(to right, #f0f2ff, #e8eaff)",
            fontFamily: "'Inter', sans-serif",
            fontSize: "1.1rem",
            padding: "1rem",
            color: "#1a237e",
            fontWeight: 500
          }}
          contentStyle={{
            fontFamily: "'Inter', sans-serif",
            fontSize: "1.1rem",
            padding: "1rem",
            background: "white"
          }}
        >
          <Descriptions.Item label="Email" className="text-lg">
            {userInfo.email}
          </Descriptions.Item>
          <Descriptions.Item label="Description" className="text-lg">
            <div className="prose prose-lg max-w-none">{userInfo.description ? parse(userInfo.description) : ""}</div>
          </Descriptions.Item>
          <Descriptions.Item label="Phone Number" className="text-lg">
            {helpers.formatPhoneNumber(userInfo.phone_number as string)}
          </Descriptions.Item>
          <Descriptions.Item label="Date of Birth" className="text-lg">
            {userInfo.dob ? helpers.formatDate(new Date(userInfo.dob)) : "-"}
          </Descriptions.Item>
          <Descriptions.Item label="Verified" className="text-lg">
            <span className={`${userInfo.is_verified ? "text-emerald-500" : "text-rose-500"} font-semibold`}>
              {userInfo.is_verified ? "Yes" : "No"}
            </span>
          </Descriptions.Item>
          <Descriptions.Item label="Created At" className="text-lg">
            {userInfo.created_at ? helpers.formatDate(new Date(userInfo.created_at)) : "-"}
          </Descriptions.Item>
          <Descriptions.Item label="Updated At" className="text-lg">
            {userInfo.updated_at ? helpers.formatDate(new Date(userInfo.updated_at)) : "-"}
          </Descriptions.Item>
        </Descriptions>
        <div className="mt-8 flex justify-end">
          <Button 
            type="primary" 
            onClick={handleEdit} 
            className="flex h-auto items-center gap-2 border-none bg-[#1a237e] px-8 py-4 text-lg transition-colors duration-300 hover:bg-[#0d1453] hover:text-white"
          >
            <EditOutlined className="text-xl transition-transform duration-300 group-hover:rotate-12" />
          </Button>
        </div>
      </div>
    );
  }
};

export default InstructorInfo;
