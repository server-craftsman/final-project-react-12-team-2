import React from 'react';
import { Card, Row, Col, Typography } from 'antd';
import { PlayCircleOutlined, ClockCircleOutlined, FileTextOutlined, TrophyOutlined } from '@ant-design/icons';
import { motion } from 'framer-motion';

const { Title, Paragraph, Text } = Typography;

interface CourseInsightsProps {
  course: any;
  instructor: any;
}

const CourseInsights: React.FC<CourseInsightsProps> = ({ course, instructor }) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <Title level={4} className="mb-4">Course Content</Title>
      <Row gutter={[16, 16]}>
        <Col xs={12} sm={6}>
          <Card className="text-center hover:shadow-lg transition-shadow duration-300">
            <PlayCircleOutlined className="text-4xl text-blue-500 mb-2" />
            <Text className="block text-gray-500">Video Length</Text>
            <Text strong className="text-lg">2h 30m</Text>
          </Card>
        </Col>
        <Col xs={12} sm={6}>
          <Card className="text-center hover:shadow-lg transition-shadow duration-300">
            <ClockCircleOutlined className="text-4xl text-blue-500 mb-2" />
            <Text className="block text-gray-500">Total Duration</Text>
            <Text strong className="text-lg">4 weeks</Text>
          </Card>
        </Col>
        <Col xs={12} sm={6}>
          <Card className="text-center hover:shadow-lg transition-shadow duration-300">
            <FileTextOutlined className="text-4xl text-blue-500 mb-2" />
            <Text className="block text-gray-500">Resources</Text>
            <Text strong className="text-lg">15 files</Text>
          </Card>
        </Col>
        <Col xs={12} sm={6}>
          <Card className="text-center hover:shadow-lg transition-shadow duration-300">
            <TrophyOutlined className="text-4xl text-blue-500 mb-2" />
            <Text className="block text-gray-500">Certificate</Text>
            <Text strong className="text-lg">Yes</Text>
          </Card>
        </Col>
      </Row>

      <Title level={4} className="mt-8 mb-4">Your Instructor</Title>
      <Card className="hover:shadow-lg transition-shadow duration-300">
        <Row gutter={16} align="middle">
          <Col xs={24} sm={6}>
            <img src={instructor?.avatar_url || ''} alt={instructor?.name} className="w-full rounded-full" />
          </Col>
          <Col xs={24} sm={18}>
            <Title level={5}>{instructor?.name}</Title>
            <Text className="block text-gray-500">{instructor?.role}</Text> 
            <Paragraph ellipsis={{ rows: 3, expandable: true, symbol: 'more' }}>
              {instructor?.description}
            </Paragraph>
          </Col>
        </Row>
      </Card>
    </motion.div>
  );
};

export default CourseInsights;
