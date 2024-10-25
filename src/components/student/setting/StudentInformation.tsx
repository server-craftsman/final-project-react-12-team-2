import usersData from "../../../data/users.json"; // Adjust the path as necessary
import { UserRole } from "../../../models/prototype/User";
import { Descriptions, Button } from "antd";
import { useNavigate } from "react-router-dom";
import { formatDate } from "../../../utils/helper";

const StudentInformation = () => {
  const navigate = useNavigate();
  const studentUser = usersData.users.find((user) => user.role === UserRole.student);

  const handleEdit = () => {
    navigate(`/dashboard-student/student/edit-user/${studentUser?.id}`);
  };

  if (studentUser) {
    return (
      <div>
        <Descriptions bordered column={1} className="mt-4">
          <Descriptions.Item label="Email" className="text-sm md:text-base">
            {studentUser.email}
          </Descriptions.Item>
          <Descriptions.Item label="Name" className="text-sm md:text-base">
            {studentUser.name}
          </Descriptions.Item>
          <Descriptions.Item label="Role" className="text-sm md:text-base">
            {studentUser.role}
          </Descriptions.Item>
          <Descriptions.Item label="Status" className="text-sm md:text-base">
            {studentUser.status ? "Active" : "Inactive"}
          </Descriptions.Item>
          <Descriptions.Item label="Description" className="text-sm md:text-base">
            {studentUser.description}
          </Descriptions.Item>
          <Descriptions.Item label="Phone Number" className="text-sm md:text-base">
            {studentUser.phone_number}
          </Descriptions.Item>
          <Descriptions.Item label="Date of Birth" className="text-sm md:text-base">
            {studentUser.dob}
          </Descriptions.Item>
          <Descriptions.Item label="Verified" className="text-sm md:text-base">
            {studentUser.is_verified ? "Yes" : "No"}
          </Descriptions.Item>
          <Descriptions.Item label="Created At" className="text-sm md:text-base">
            {formatDate(new Date(studentUser.created_at))}
          </Descriptions.Item>
          <Descriptions.Item label="Updated At" className="text-sm md:text-base">
            {formatDate(new Date(studentUser.updated_at))}
          </Descriptions.Item>
        </Descriptions>
        <Button type="primary" onClick={handleEdit} className="mt-4 md:-ml-0 md:mt-2">
          Edit Profile
        </Button>
      </div>
    );
  } else {
    return <div className="text-center text-red-500">No student user found.</div>;
  }
};

export default StudentInformation;
