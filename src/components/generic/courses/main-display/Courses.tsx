import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { Typography, Card, Row, Col, Button, Tag, Avatar } from "antd";
import { BookOutlined, PercentageOutlined, VideoCameraOutlined, ClockCircleOutlined } from "@ant-design/icons";
import { motion } from "framer-motion";
import { GetPublicCourseResponse } from "../../../../models/api/responsive/course/course.response.model";
// import { User } from "../../../../models/api/responsive/users/users.model";
// import { GetCategoryResponse } from "../../../../models/api/responsive/admin/category.responsive.model";
import { CourseService } from "../../../../services/course/course.service";
// import { UserService } from "../../../../services/admin/user.service";
import { helpers } from "../../../../utils";
const { Title, Paragraph } = Typography;
const { Meta } = Card;
import parse from "html-react-parser";

interface CoursesProps {
  pageSize?: number;
  pageNum?: number;
  // usersData: User[];
  // categoriesData: GetCategoryResponse;
}

const fetchCoursePublic = async (searchCondition = {}, pageInfo = { pageNum: 1, pageSize: 10 }) => {
  const response = await CourseService.getPublicCourse({
    searchCondition: {
      keyword: "",
      category_id: "",
      is_delete: false,
      status: "active",
      ...searchCondition
    },
    pageInfo: {
      ...pageInfo
    }
  });
  return response.data;
};

const Courses: React.FC<CoursesProps> = ({ pageSize = 10, pageNum = 1 }) => {
  const [courses, setCourses] = useState<GetPublicCourseResponse | null>(null);

  useEffect(() => {
    const fetchCourses = async () => {
      try {
        const coursesData = await fetchCoursePublic();
        setCourses(coursesData.data);
      } catch (error) {
        console.error("Failed to fetch courses:", error);
      }
    };

    fetchCourses();
  }, []);

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
      {courses?.pageData.slice((pageNum - 1) * pageSize, pageNum * pageSize).map((course: any) => {
        return (
          <Col xs={24} sm={12} md={8} key={course._id} className="mx-auto h-full">
            <motion.div variants={itemVariants} className="h-full">
              <Card
                hoverable
                cover={<img alt={course.name} src={course.image_url} className="h-48 w-full object-cover" />}
                className={`group relative flex h-[600px] flex-col overflow-hidden rounded-lg bg-white shadow-lg transition-all duration-300 hover:shadow-xl`}
                style={{
                  display: "flex",
                  flexDirection: "column"
                }}
              >
                {course.discount > 0 && (
                  <motion.div className="bg-gradient-tone absolute left-0 top-0 rounded-br-lg px-3 py-1 text-white" whileHover={{ scale: 1.05 }}>
                    <PercentageOutlined className="mr-1" />
                    {course.discount}% OFF
                  </motion.div>
                )}
                <div className="flex h-[450px] flex-col">
                  <Title level={3} className="mb-2 line-clamp-2 h-16 text-xl font-bold text-[#1a237e] transition duration-300 hover:text-indigo-900">
                    {course.name}
                  </Title>
                  <Paragraph className="mb-4 line-clamp-2 h-11 text-gray-600" ellipsis={{ rows: 2 }}>
                    {parse(course.description)}
                  </Paragraph>
                  <div className="h-[100px]">
                    <div className="mb-4 flex items-center justify-between">
                      <span className="text-2xl font-bold text-indigo-800">${helpers.moneyFormat(course.price * (1 - course.discount / 100))}</span>
                      {course.discount > 0 && <span className="text-lg text-gray-500 line-through">${helpers.moneyFormat(course.price)}</span>}
                    </div>
                    <div className="mb-4 flex justify-start">
                      {course.is_purchased && (
                        <button type="button" className="rounded-lg border-none bg-gradient-to-r from-green-400 to-green-600 px-4 font-semibold text-white shadow-lg transition-all duration-300 hover:from-green-500 hover:to-green-700" disabled>
                          PURCHASED
                        </button>
                      )}
                    </div>
                  </div>

                  <Meta
                    title={<span className="line-clamp-1 text-lg font-semibold text-gray-800">{course.instructor_name}</span>}
                    description={
                      <div className="h-25 mb-4 items-center text-sm">
                        <div>
                          <Tag className="bg-gradient-tone mr-2 rounded px-2 py-1 text-xs font-semibold uppercase text-white">{course.category_name}</Tag>
                        </div>
                        <div className="mt-4 flex items-center space-x-4">
                          <span className="flex items-center font-medium text-gray-600">
                            <BookOutlined className="mr-2 text-indigo-500" />
                            <span className="bg-gradient-to-r from-indigo-500 to-purple-500 bg-clip-text text-transparent">{course.session_count} Sessions</span>
                          </span>
                          <span className="flex items-center font-medium text-gray-600">
                            <VideoCameraOutlined className="mr-2 text-indigo-500" />
                            <span className="bg-gradient-to-r from-indigo-500 to-purple-500 bg-clip-text text-transparent">{course.lesson_count} Lessons</span>
                          </span>
                          <span className="flex items-center font-medium text-gray-600">
                            <ClockCircleOutlined className="mr-2 text-indigo-500" />
                            <span className="bg-gradient-to-r from-indigo-500 to-purple-500 bg-clip-text text-transparent">{course.full_time} min</span>
                          </span>
                        </div>
                      </div>
                    }
                    className="mb-4"
                  />
                </div>

                <motion.div className="absolute inset-x-0 bottom-0 h-12 translate-y-full transform transition-all duration-300 group-hover:translate-y-0" whileHover={{ scale: 1.05 }}>
                  <Link to={`/course/${course._id}`}>
                    <Button type="primary" block size="large" className="bg-gradient-tone hover:bg-gradient-tone-hover border-none">
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
