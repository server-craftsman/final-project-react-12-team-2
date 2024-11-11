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
      <Title level={3} className="text-gold mb-6 font-extrabold">
        Course Insights
      </Title>
      <Row gutter={[24, 24]}>
        <Col xs={12} sm={6}>
          <Card className="border-gold rounded-lg border text-center transition-shadow duration-300 hover:shadow-2xl">
            <PlayCircleOutlined className="text-gold mb-3 text-5xl" />
            <Text className="block font-medium text-gray-600">Video Length</Text>
            <Text strong className="text-gold text-xl">
              {course.full_time} minutes
            </Text>
          </Card>
        </Col>
        <Col xs={12} sm={6}>
          <Card className="border-gold rounded-lg border text-center transition-shadow duration-300 hover:shadow-2xl">
            <StarOutlined className="text-gold mb-3 text-5xl" />
            <Text className="block font-medium text-gray-600">Total Reviews</Text>
            <Text strong className="text-gold text-xl">
              {course.review_count} reviews
            </Text>
          </Card>
        </Col>
        {/* <Col xs={12} sm={6}>
          <Card className="text-center transition-shadow duration-300 hover:shadow-2xl border border-gold rounded-lg">
            <FileTextOutlined className="mb-3 text-5xl text-gold" />
            <Text className="block text-gray-600 font-medium">Resources</Text>
            <Text strong className="text-xl text-gold">
              {course.session_count} sessions {course.lesson_count} lessons
            </Text>
          </Card>
        </Col> */}
      </Row>
      <Text className="mt-6 block text-2xl font-bold leading-loose text-gray-800">{parse(content)}</Text>
    </motion.div>
  );
};

export default CourseInsights;
