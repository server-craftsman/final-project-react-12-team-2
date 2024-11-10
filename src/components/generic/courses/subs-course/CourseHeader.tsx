import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { Tag, Typography } from "antd";
import { PlayCircleOutlined } from "@ant-design/icons";
import { CourseHeaderProps } from "../../../../models/objects/course/CourseHeaderProps";
import { UserService } from "../../../../services/admin/user.service";
const { Title, Paragraph, Text } = Typography;
import parse from "html-react-parser";

const CourseHeader: React.FC<CourseHeaderProps> = ({ course, instructor, showVideoModal }) => {
  const [instructorData, setInstructorData] = useState<any>(null);

  useEffect(() => {
    const fetchInstructorData = async () => {
      if (!instructor) {
        console.error("Instructor ID is undefined");
        return;
      }
      try {
        const response = await UserService.getUserDetails(instructor);
        setInstructorData(response.data.data);
      } catch (error) {
        console.error("Failed to fetch instructor data:", error);
      }
    };
    fetchInstructorData();
  }, [instructor]);
  return (
    <>
      <div className="relative" onClick={showVideoModal}>
        <img src={course.image_url} alt={course.name} className="h-64 w-full object-cover" />
        <div className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-50">
          <PlayCircleOutlined className="cursor-pointer text-6xl text-white transition-colors duration-300 hover:text-blue-300" />
        </div>
      </div>
      <div className="p-2">
        <Tag color="#1a237e" className="mb-1">
          {course.category_name}
        </Tag>
        <Title level={2} className="mb-1">
          {course.name}
        </Title>
        <Paragraph className="mb-1 text-gray-600">{parse(course.description)}</Paragraph>

        {instructorData && (
          <Link to={`/profile/${instructorData._id}`}>
            <div className="mb-4 flex items-center space-x-4 rounded-lg bg-gradient-to-r from-gray-50 to-white p-2 shadow-lg">
              <img src={instructorData.avatar_url} className="h-16 w-16 rounded-full border-4 border-white object-cover shadow-md transition duration-300 hover:scale-105" alt={instructorData.name} />
              <div className="flex flex-col space-y-1">
                <Text strong className="text-xl font-bold text-gray-800 transition duration-300 hover:text-indigo-900">
                  {instructorData.name}
                </Text>
                <Text className="text-md text-gray-600 transition duration-300 hover:text-indigo-700">{instructorData.email}</Text>
              </div>
            </div>
          </Link>
        )}
      </div>
    </>
  );
};

export default CourseHeader;
