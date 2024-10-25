import React from "react";
import { Link } from "react-router-dom";
import { Typography, Card, Row, Col, Button, Tag, Avatar, Rate } from "antd";
import { CrownOutlined, BookOutlined, PercentageOutlined } from "@ant-design/icons";
import { Course, CourseStatusEnum } from "../../../../models/prototype/Course";
import { User } from "../../../../models/prototype/User";
import categoriesData from "../../../../data/categories.json";
import { motion } from "framer-motion";
import { Category } from "../../../../models/prototype/Category";
const { Title, Paragraph } = Typography;
const { Meta } = Card;
interface CoursesProps {
  courses: Course[];
  usersData: { users: User[] };
  categoriesData: { categories: Category[] };
}

const Courses: React.FC<CoursesProps> = ({ courses, usersData }) => {
  if (courses.length === 0) {
    return <div>No courses available.</div>;
  }

  const instructor = usersData.users.find((user) => user.id === courses[0].user_id) as User;
  const discountedPrice = (courses[0].price - (courses[0].price * courses[0].discount) / 100).toFixed(2);

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: {
        type: "spring",
        stiffness: 100
      }
    }
  };

  return (
    <Row gutter={[32, 32]}>
      {courses.map((course: Course) => {
        return (
          <Col xs={24} sm={12} md={8} key={course.id} className="mx-auto h-full">
            <motion.div variants={itemVariants} className="h-full">
              <Card
                hoverable
                cover={<img alt={course.name} src={course.image_url} className="h-48 w-full object-cover" />}
                className="group relative flex h-full flex-col overflow-hidden rounded-lg bg-white shadow-lg transition-all duration-300 hover:shadow-xl"
                style={{
                  height: "100%",
                  display: "flex",
                  flexDirection: "column"
                }}
              >
                <motion.div className="absolute right-0 top-0 rounded-bl-lg bg-[#8529ff] px-3 py-1 text-white" whileHover={{ scale: 1.05 }}>
                  <CrownOutlined className="mr-1" />
                  {course.status === CourseStatusEnum.active ? "Premium" : "Draft"}
                </motion.div>
                {course.discount > 0 && (
                  <motion.div className="absolute left-0 top-0 rounded-br-lg bg-[#8529ff] px-3 py-1 text-white" whileHover={{ scale: 1.05 }}>
                    <PercentageOutlined className="mr-1" />
                    {course.discount}% OFF
                  </motion.div>
                )}
                <div className="flex h-full flex-col">
                  <Meta
                    avatar={<Avatar src={instructor.avatar_url} />}
                    title={<span className="line-clamp-1 text-lg font-semibold text-gray-800">{instructor.name}</span>}
                    description={
                      <div className="mb-4 flex items-center text-sm">
                        <Tag className="mr-2 rounded bg-[#8529ff] px-2 py-1 text-xs font-semibold uppercase text-white">{categoriesData.categories.find((category) => category.id === course.category_id)?.name}</Tag>
                        <div className="flex items-center">
                          <BookOutlined className="mr-1 text-gray-600" />
                          <span className="text-sm text-gray-600">{course.content.split(" ").length} lessons</span>
                        </div>
                      </div>
                    }
                    className="mb-4"
                  />
                  <Title level={4} className="mb-2 line-clamp-2 h-14 text-xl font-bold text-gray-800">
                    {course.name}
                  </Title>
                  <Paragraph className="h-18 mb-4 line-clamp-3 flex-grow text-gray-600">{course.description}</Paragraph>
                  <div className="mt-auto">
                    <div className="mb-4 flex items-center justify-between">
                      <span className="text-2xl font-bold text-purple-700">${discountedPrice}</span>
                      {course.discount > 0 && <span className="text-lg text-gray-500 line-through">${course.price}</span>}
                      <Rate disabled defaultValue={4.5} className="text-yellow-400" />
                    </div>
                  </div>
                </div>
                <motion.div className="absolute inset-x-0 bottom-0 translate-y-full transform transition-all duration-300 group-hover:translate-y-0" whileHover={{ scale: 1.05 }}>
                  <Link to={`/course/${course.id}`}>
                    <Button type="primary" block size="large" className="border-none bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700">
                      Preview This Course
                    </Button>
                  </Link>
                </motion.div>
              </Card>
            </motion.div>
          </Col>
        );
      })}
    </Row>
  );
};

export default Courses;
