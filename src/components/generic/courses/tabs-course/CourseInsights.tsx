import React from "react";
import { Card, Row, Col, Typography } from "antd";
import { PlayCircleOutlined, StarOutlined } from "@ant-design/icons";
import { motion } from "framer-motion";
import { CourseInsightsProps } from "../../../../models/objects/course/CourseInsightsProps";
import parse from "html-react-parser";
const { Title, Text } = Typography;

const CourseInsights: React.FC<CourseInsightsProps & { course: string, content: string }> = ({ course, content }) => {
  return (
    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
      <Title level={3} className="mb-6 text-gold font-extrabold">
        Course Insights
      </Title>
      <Row gutter={[24, 24]}>
        <Col xs={12} sm={6}>
          <Card className="text-center transition-shadow duration-300 hover:shadow-2xl border border-gold rounded-lg">
            <PlayCircleOutlined className="mb-3 text-5xl text-gold" />
            <Text className="block text-gray-600 font-medium">Video Length</Text>
            <Text strong className="text-xl text-gold">
              {course.full_time} minutes
            </Text>
          </Card>
        </Col>
        <Col xs={12} sm={6}>
          <Card className="text-center transition-shadow duration-300 hover:shadow-2xl border border-gold rounded-lg">
            <StarOutlined className="mb-3 text-5xl text-gold" />
            <Text className="block text-gray-600 font-medium">Total Reviews</Text>
            <Text strong className="text-xl text-gold">
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
      <Text className="block text-gray-800 text-2xl leading-loose font-bold mt-6">{parse(content)}</Text>
    </motion.div>
  );
};

export default CourseInsights;
