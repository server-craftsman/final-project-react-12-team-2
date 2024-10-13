import React from "react";
import { Tag, Typography } from "antd";
import { PlayCircleOutlined } from "@ant-design/icons";
import { CourseHeaderProps } from "../../../../models/objects/course/CourseHeaderProps";
const { Title, Paragraph, Text } = Typography;

const CourseHeader: React.FC<CourseHeaderProps> = ({
  course,
  category,
  instructor,
  showVideoModal,
}) => {
  return (
    <>
      <div className="relative">
        <img
          src={course.image_url}
          alt={course.name}
          className="h-64 w-full object-cover"
        />
        <div className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-50">
          <PlayCircleOutlined
            className="cursor-pointer text-6xl text-white transition-colors duration-300 hover:text-blue-300"
            onClick={showVideoModal}
          />
        </div>
      </div>
      <div className="p-6">
        <Tag color="blue" className="mb-4">
          {category?.name}
        </Tag>
        <Title level={2} className="mb-4">
          {course.name}
        </Title>
        <Paragraph className="mb-6 text-gray-600">
          {course.description}
        </Paragraph>
        <div className="mb-6 flex items-center">
          <img
            src={instructor?.avatar_url}
            className="mr-2 h-12 w-12 rounded-full"
          />
          <Text strong className="text-gray-700">
            {instructor?.name}
          </Text>
        </div>
      </div>
    </>
  );
};

export default CourseHeader;
