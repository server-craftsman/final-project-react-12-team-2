import React from "react";
import { Card, Row, Col, Typography } from "antd";
import { PlayCircleOutlined, StarOutlined } from "@ant-design/icons";
import { motion } from "framer-motion";
import { CourseInsightsProps } from "../../../../models/objects/course/CourseInsightsProps";
import parse from "html-react-parser";
const { Title, Text } = Typography;

const CourseInsights: React.FC<CourseInsightsProps & { course: string; content: string }> = ({ course, content }) => {
  return (
    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
      <Title level={3} className="mb-6 font-extrabold text-gold md:text-3xl sm:text-2xl text-xl">
        Course Insights
      </Title>
      <Row gutter={[24, 24]}>
        <Col xs={24} sm={12} md={6}>
          <Card className="border-gold rounded-lg border text-center transition-shadow duration-300 hover:shadow-2xl">
            <PlayCircleOutlined className="mb-3 text-4xl text-gold md:text-5xl" />
            <Text className="block text-sm font-medium text-gray-600 md:text-base">Video Length</Text>
            <Text strong className="text-lg text-gold md:text-xl">
              {course.full_time} minutes
            </Text>
          </Card>
        </Col>
        <Col xs={24} sm={12} md={6}>
          <Card className="border-gold rounded-lg border text-center transition-shadow duration-300 hover:shadow-2xl">
            <StarOutlined className="mb-3 text-4xl text-gold md:text-5xl" />
            <Text className="block text-sm font-medium text-gray-600 md:text-base">Total Reviews</Text>
            <Text strong className="text-lg text-gold md:text-xl">
              {course.review_count} reviews
            </Text>
          </Card>
        </Col>
        {/* <Col xs={24} sm={12} md={6}>
          <Card className="text-center transition-shadow duration-300 hover:shadow-2xl border border-gold rounded-lg">
            <FileTextOutlined className="mb-3 text-4xl text-gold md:text-5xl" />
            <Text className="block text-sm text-gray-600 font-medium md:text-base">Resources</Text>
            <Text strong className="text-lg text-gold md:text-xl">
              {course.session_count} sessions {course.lesson_count} lessons
            </Text>
          </Card>
        </Col> */}
      </Row>
      <Text className="mt-6 block text-lg font-bold leading-loose text-gray-800 md:text-2xl sm:text-xl">
        {parse(content)}
      </Text>
    </motion.div>
  );
};

export default CourseInsights;
