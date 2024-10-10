import React from 'react';
import { Tag, Typography } from 'antd';
import { PlayCircleOutlined } from '@ant-design/icons';
import { CourseHeaderProps } from '../../../../models/objects/course/CourseHeaderProps';
const { Title, Paragraph, Text } = Typography;

const CourseHeader: React.FC<CourseHeaderProps> = ({ course, category, instructor, showVideoModal }) => {
  return (
    <>
      <div className="relative">
        <img
          src={course.image_url}
          alt={course.name}
          className="w-full h-64 object-cover"
        />
        <div className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center">
          <PlayCircleOutlined 
            className="text-6xl text-white hover:text-blue-300 transition-colors duration-300 cursor-pointer"
            onClick={showVideoModal}
          />
        </div>
      </div>
      <div className="p-6">
        <Tag color="blue" className="mb-4">{category?.name}</Tag>
        <Title level={2} className="mb-4">{course.name}</Title>
        <Paragraph className="text-gray-600 mb-6">{course.description}</Paragraph>
        <div className="flex items-center mb-6">
          <img src={instructor?.avatar_url} className="mr-2 w-12 h-12 rounded-full" />
          <Text strong className="text-gray-700">{instructor?.name}</Text>
        </div>
      </div>
    </>
  );
};

export default CourseHeader;