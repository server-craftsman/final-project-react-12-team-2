import { useEffect } from "react";
import { Descriptions, Button } from "antd";
import { EditOutlined } from "@ant-design/icons";
import { useNavigate } from "react-router-dom";
import { formatDate } from "../../../utils/helper";
import { useAuth } from "../../../contexts/AuthContext";
import parse from 'html-react-parser';

const AdminInfo: React.FC = () => {
  const navigate = useNavigate();
  const { getCurrentUser, userInfo } = useAuth();

  useEffect(() => {
    getCurrentUser();
  }, []);

  const handleEdit = () => {
    navigate(`/admin/edit-user/${userInfo?._id}`);
  };

  if (!userInfo) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="text-2xl font-serif text-[#1a237e] italic">
          No admin user found.
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-10xl p-8 mx-auto bg-white shadow-2xl rounded-xl animate-fade-in">
      <div className="flex flex-col items-center mb-8">
        {userInfo.avatar_url ? (
      <img 
        src={userInfo.avatar_url} 
        alt="User avatar" 
        className="w-40 h-40 rounded-full object-cover border-4 border-[#1a237e] shadow-lg hover:scale-105 transition-transform duration-300"
      />
    ) : (
      <div className="w-40 h-40 rounded-full bg-gray-200 flex items-center justify-center border-4 border-[#1a237e]">
        <span className="text-2xl text-gray-500">No Avatar</span>
      </div>
    )}
    <h2 className="mt-4 text-2xl font-bold text-[#1a237e]">{userInfo.name}</h2>
    <p className="text-gray-600 italic">{userInfo.role}</p>
  </div>

  <Descriptions 
    bordered 
    column={1} 
    className="mt-4"
    labelStyle={{ 
      backgroundColor: '#f0f2ff',
      fontFamily: 'sans-serif',
      fontSize: '1rem',
      padding: '0.75rem',
      color: '#666'
    }}
    contentStyle={{
      fontFamily: 'sans-serif',
      fontSize: '1rem',
      padding: '0.75rem'
    }}
  >
    <Descriptions.Item label="Email" className="text-base">
      {userInfo.email}
    </Descriptions.Item>
    <Descriptions.Item label="Description" className="text-base">
      <div className="prose max-w-none">
        {userInfo.description ? parse(userInfo.description) : ''}
      </div>
    </Descriptions.Item>
    <Descriptions.Item label="Phone Number" className="text-base">
      {userInfo.phone_number}
    </Descriptions.Item>
    <Descriptions.Item label="Date of Birth" className="text-base">
      {formatDate(new Date(userInfo.dob))}
    </Descriptions.Item>
    <Descriptions.Item label="Verified" className="text-base">
      <span className={userInfo.is_verified ? "text-green-600" : "text-red-600"}>
        {userInfo.is_verified ? "Yes" : "No"}
      </span>
    </Descriptions.Item>
    <Descriptions.Item label="Created At" className="text-base">
      {formatDate(new Date(userInfo.created_at))}
    </Descriptions.Item>
    <Descriptions.Item label="Updated At" className="text-base">
      {formatDate(new Date(userInfo.updated_at))}
    </Descriptions.Item>
  </Descriptions>
  <div className="flex justify-end mt-6">
    <Button
      type="primary"
      onClick={handleEdit}
      className="px-8 py-4 h-auto text-lg flex items-center gap-2 bg-[#1a237e] hover:bg-[#0d1453] border-none transition-colors duration-300"
    >
      <EditOutlined />
    </Button>
      </div>
    </div>
  );
};

export default AdminInfo;