import { Typography, Descriptions, Button } from "antd";
import { useState, useEffect } from "react";
import { User } from "../../../models/api/responsive/users/users.model";
import { useAuth } from "../../../contexts/AuthContext";
import { useNavigate } from "react-router-dom";
import { formatDate } from "../../../utils/helper";
import { UserService } from "../../../services/admin/user.service";
const { Title } = Typography;

const InstructorInfo: React.FC = () => {
  const navigate = useNavigate();
  const { userInfo } = useAuth();
  const [instructorUser, setInstructorUser] = useState<User | null>(null);

  useEffect(() => {
    const fetchUserDetails = async () => {
      if (userInfo?._id) {
        try {
          const response = await UserService.getUserDetails(userInfo._id);
          console.log("Fetched user details:", response); // Log the response
          if (response && response.data) {
            const userData: User = {
              _id: response.data.data._id,
              name: response.data.data.name,
              email: response.data.data.email,
              phone_number: response.data.data.phone_number,
              role: response.data.data.role,
              status: response.data.data.status,
              description: response.data.data.description,
              dob: new Date(response.data.data.dob),
              balance: response.data.data.balance,
              avatar_url: response.data.data.avatar_url,
              google_id: response.data.data.google_id,
              video_url: response.data.data.video_url,
              is_verified: response.data.data.is_verified,
              verification_token: response.data.data.verification_token,
              verification_token_expires: new Date(
                response.data.data.verification_token_expires,
              ),
              token_version: response.data.data.token_version,
              balance_total: response.data.data.balance_total,
              bank_name: response.data.data.bank_name,
              bank_account_no: response.data.data.bank_account_no,
              bank_account_name: response.data.data.bank_account_name,
              created_at: new Date(response.data.data.created_at),
              updated_at: new Date(response.data.data.updated_at),
              is_deleted: response.data.data.is_deleted,
              __v: response.data.data.__v,
            };
            setInstructorUser(userData);
            console.log("User details set:", userData); // Log the set data
          } else {
            setInstructorUser(null);
          }
        } catch (error) {
          console.error("Error fetching user details:", error);
          setInstructorUser(null);
        }
      } else {
        console.log("No user ID found in userInfo");
      }
    };

    fetchUserDetails();
  }, [userInfo]);
  
  if (!instructorUser) {
    return (
      <div className="text-center text-red-500">No instructor user found.</div>
    );
  }

  const handleEdit = () => {
    navigate(`/instructor/edit-user/${instructorUser?._id}`);
  };
  if (!instructorUser) {
    return <div className="text-center text-red-500">No admin user found.</div>;
  } else {
    return (
      <div className="min-h-screen bg-gray-100 md:p-10">
        <div className="flex-col items-center justify-between md:flex-row">
          <Title className="text-2xl font-bold">Setting</Title>

          <Descriptions bordered column={1} className="mt-4">
            <Descriptions.Item label="Email" className="text-sm md:text-base">
              {instructorUser.email}
            </Descriptions.Item>
            <Descriptions.Item label="Name" className="text-sm md:text-base">
              {instructorUser.name}
            </Descriptions.Item>
            <Descriptions.Item label="Role" className="text-sm md:text-base">
              {instructorUser.role}
            </Descriptions.Item>
            <Descriptions.Item label="Status" className="text-sm md:text-base">
              {instructorUser.status ? "Active" : "Inactive"}
            </Descriptions.Item>
            <Descriptions.Item
              label="Description"
              className="text-sm md:text-base"
            >
              {instructorUser.description}
            </Descriptions.Item>
            <Descriptions.Item
              label="Phone Number"
              className="text-sm md:text-base"
            >
              {instructorUser.phone_number}
            </Descriptions.Item>
            <Descriptions.Item
              label="Date of Birth"
              className="text-sm md:text-base"
            >
              {formatDate(new Date(instructorUser.dob))}
            </Descriptions.Item>
            <Descriptions.Item
              label="Verified"
              className="text-sm md:text-base"
            >
              {instructorUser.is_verified ? "Yes" : "No"}
            </Descriptions.Item>
            <Descriptions.Item
              label="Created At"
              className="text-sm md:text-base"
            >
              {formatDate(new Date(instructorUser.created_at))}
            </Descriptions.Item>
            <Descriptions.Item
              label="Updated At"
              className="text-sm md:text-base"
            >
              {formatDate(new Date(instructorUser.updated_at))}
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
      </div>
    );
  }
};

export default InstructorInfo;
