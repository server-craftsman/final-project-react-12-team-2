import usersData from "../../../data/users.json"; // Adjust the path as necessary
import { UserRole } from "../../../models/User";
import { Typography, Descriptions, Button } from "antd";
import { useNavigate } from "react-router-dom";

const { Title } = Typography;

const InstructorInfo = () => {
    const navigate = useNavigate();
    const instructorUser = usersData.users.find(
        (user) => user.role === UserRole.INSTRUCTOR
    );

    if (!instructorUser) {
        return <div className="text-center text-red-500">No instructor user found.</div>;
    }

    const handleEdit = () => {
        navigate(`/instructor/edit-user/${instructorUser.id}`);
    };

    return (
        <div className="min-h-screen bg-gray-100 p-5 md:p-10">
            <div className="flex-col md:flex-row justify-between items-center">
                <Title className="">Setting</Title>

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
                    <Descriptions.Item
                        label="Status"
                        className="text-sm md:text-base"
                    >
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
                        {instructorUser.dob}
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
                        {new Date(instructorUser.created_at).toLocaleString()}
                    </Descriptions.Item>
                    <Descriptions.Item
                        label="Updated At"
                        className="text-sm md:text-base"
                    >
                        {new Date(instructorUser.updated_at).toLocaleString()}
                    </Descriptions.Item>
                </Descriptions>
                <Button
                    type="primary"
                    onClick={handleEdit}
                    className="mt-4 md:mt-2 md:-ml-0"
                >
                    Edit Profile
                </Button>

            </div>
        </div>
    );
};

export default InstructorInfo;