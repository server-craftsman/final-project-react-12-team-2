import { useEffect } from "react";
import { Descriptions, Button } from "antd";
import { useNavigate } from "react-router-dom";
import { formatDate } from "../../../utils/helper";

import { useAuth } from "../../../contexts/AuthContext";
// import { AuthService } from "../../../services/authentication/auth.service";
// import { User} from "../../../models/api/responsive/users/users.model";

const AdminInfo: React.FC = () => {
  // const [adminUser, setAdminUser] = useState<User | null>(null);
  const navigate = useNavigate();
  const { getCurrentUser, userInfo } = useAuth();

  useEffect(() => {
    getCurrentUser();
  }, []);

  const handleEdit = () => {
    navigate(`/admin/edit-user/${userInfo?._id}`);
  };

  if (!userInfo) {
    return <div className="text-center text-red-500">No admin user found.</div>;
  } else {
    return (
      <div>
      <Descriptions bordered column={1} className="mt-4">
        <Descriptions.Item label="Email" className="text-sm md:text-base">
          {userInfo.email}
        </Descriptions.Item>
        <Descriptions.Item label="Name" className="text-sm md:text-base">
          {userInfo.name}
        </Descriptions.Item>
        <Descriptions.Item label="Role" className="text-sm md:text-base">
          {userInfo.role}
        </Descriptions.Item>
        <Descriptions.Item label="Status" className="text-sm md:text-base">
          {userInfo.status ? "Active" : "Inactive"}
        </Descriptions.Item>
        <Descriptions.Item label="Description" className="text-sm md:text-base">
          {userInfo.description}
        </Descriptions.Item>
        <Descriptions.Item
          label="Phone Number"
          className="text-sm md:text-base"
        >
          {userInfo.phone_number}
        </Descriptions.Item>
        <Descriptions.Item
          label="Date of Birth"
          className="text-sm md:text-base"
        >
          {formatDate(new Date(userInfo.dob))}
        </Descriptions.Item>
        <Descriptions.Item label="Verified" className="text-sm md:text-base">
          {userInfo.is_verified ? "Yes" : "No"}
        </Descriptions.Item>
        <Descriptions.Item label="Created At" className="text-sm md:text-base">
          {formatDate(new Date(userInfo.created_at))}
        </Descriptions.Item>
        <Descriptions.Item label="Updated At" className="text-sm md:text-base">
          {formatDate(new Date(userInfo.updated_at))}
        </Descriptions.Item>
      </Descriptions>
      <Button
        type="primary"
        onClick={handleEdit}
        className="mt-4 md:-ml-0 md:mt-2"
      >
        Edit Profile
      </Button>
      </div>
    );
  }
};

export default AdminInfo;
