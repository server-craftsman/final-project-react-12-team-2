import { useAuth } from "../../../contexts/AuthContext";
import { useEffect } from "react";
import { Descriptions, Button } from "antd";
import { useNavigate } from "react-router-dom";
import { helpers } from "../../../utils";
// import parse from "html-react-parser";
import { EditOutlined } from "@ant-design/icons";
import { ROUTER_URL } from "../../../const/router.path";
const StudentInformation = () => {
  const navigate = useNavigate();
  // const studentUser = usersData.users.find((user) => user.role === UserRole.student);
  const { getCurrentUser, userInfo } = useAuth();

  useEffect(() => {
    getCurrentUser();
  }, []);

  const handleEdit = () => {
    navigate(ROUTER_URL.STUDENT.EDIT_USER.replace(":id", userInfo?._id as string));
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
          <img
            src={userInfo.avatar_url || `https://ui-avatars.com/api/?name=${userInfo.name[0]}`}
            alt="Avatar"
            className="h-52 w-52 rounded-full"
            onError={(e) => {
              e.currentTarget.src = `https://ui-avatars.com/api/?name=${userInfo.name[0]}`;
            }}
          />
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
            <div className="prose max-w-none"><span dangerouslySetInnerHTML={{ __html: userInfo.description }}></span></div>
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

export default StudentInformation;
