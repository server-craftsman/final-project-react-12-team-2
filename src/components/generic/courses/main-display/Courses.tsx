import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Typography, Card, Row, Col, Button, Tag, Avatar } from "antd";
import { BookOutlined, PercentageOutlined, VideoCameraOutlined, ClockCircleOutlined } from "@ant-design/icons";
import { motion, AnimatePresence } from "framer-motion";
import { GetPublicCourseResponse } from "../../../../models/api/responsive/course/course.response.model";
// import { User } from "../../../../models/api/responsive/users/users.model";
// import { GetCategoryResponse } from "../../../../models/api/responsive/admin/category.responsive.model";
import { CourseService } from "../../../../services/course/course.service";
// import { UserService } from "../../../../services/admin/user.service";
import { helpers } from "../../../../utils";
const { Title, Paragraph } = Typography;
import animationData from "../../../../data/courseAnimation.json";
import Lottie from "lottie-react";
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
  const navigate = useNavigate();
  const [courses, setCourses] = useState<GetPublicCourseResponse | null>(null);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    const fetchCourses = async () => {
      try {
        const coursesData = await fetchCoursePublic();
        setCourses(coursesData.data);
      } catch (error) {
        console.error("Failed to fetch courses:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchCourses();
  }, []);

  const itemVariants = {
    hidden: { y: 50, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: {
        type: "spring",
        stiffness: 100,
        damping: 12
      }
    }
  };

  const cardVariants = {
    rest: { scale: 1 },
    hover: { 
      scale: 1.02,
      boxShadow: "0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)",
      transition: {
        type: "spring",
        stiffness: 300,
        damping: 20
      }
    }
  };

  const buttonVariants = {
    rest: { y: "100%" },
    hover: { 
      y: 0,
      transition: {
        type: "spring",
        stiffness: 500,
        damping: 30
      }
    }
  };

  return (
    <Row gutter={[32, 32]}>
      <AnimatePresence>
        {loading ? (
          <div className="flex justify-center items-center h-full w-full">
            <Lottie height={400} width={400} animationData={animationData} />
          </div>
        ) : (
          courses?.pageData.slice((pageNum - 1) * pageSize, pageNum * pageSize).map((course: any, index) => {
            return (
              <Col xs={24} sm={12} md={8} key={course._id} className="mx-auto h-full">
                <motion.div
                  variants={itemVariants}
                  initial="hidden"
                  animate="visible"
                  exit="hidden"
                  transition={{ delay: index * 0.1 }}
                  className="h-full"
                >
                  <motion.div
                    variants={cardVariants}
                    initial="rest"
                    whileHover="hover"
                    whileTap={{ scale: 0.98 }}
                  >
                    <Card
                      hoverable
                      cover={
                        <motion.img 
                          alt={course.name} 
                          src={course.image_url} 
                          className="h-48 w-full object-cover"
                          whileHover={{ scale: 1.05 }}
                          transition={{ duration: 0.3 }}
                        />
                      }
                      className={`group relative flex h-[600px] flex-col overflow-hidden rounded-lg bg-white shadow-lg`}
                      style={{
                        display: "flex",
                        flexDirection: "column"
                      }}
                    >
                      {course.discount > 0 && (
                        <motion.div 
                          className="bg-gradient-tone absolute left-0 top-0 rounded-br-lg px-3 py-1 text-white"
                          whileHover={{ scale: 1.1 }}
                          whileTap={{ scale: 0.95 }}
                          initial={{ x: -100 }}
                          animate={{ x: 0 }}
                          transition={{ type: "spring", stiffness: 300 }}
                        >
                          <PercentageOutlined className="mr-1" />
                          {course.discount}% OFF
                        </motion.div>
                      )}
                      <div className="flex h-[450px] flex-col">
                        <motion.div
                          initial={{ opacity: 0, y: 20 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ delay: 0.2 }}
                        >
                          <Title level={3} className="mb-2 line-clamp-2 h-16 text-xl font-bold text-[#1a237e] transition duration-300 hover:text-indigo-900">
                            {course.name}
                          </Title>
                          <Paragraph className="mb-4 line-clamp-2 h-11 text-gray-600" ellipsis={{ rows: 2 }}>
                            {parse(course.description)}
                          </Paragraph>
                        </motion.div>
                        <div className="h-[100px]">
                          <motion.div 
                            className="mb-4 flex items-center justify-between"
                            whileHover={{ scale: 1.02 }}
                          >
                            <span className="text-2xl font-bold text-indigo-800">${helpers.moneyFormat(course.price * (1 - course.discount / 100))}</span>
                            {course.discount > 0 && <span className="text-lg text-gray-500 line-through">${helpers.moneyFormat(course.price)}</span>}
                          </motion.div>
                          <div className="mb-4 flex justify-start">
                            {course.is_purchased && (
                              <motion.button
                                whileHover={{ scale: 1.05 }}
                                whileTap={{ scale: 0.95 }}
                                type="button" 
                                className="rounded-lg border-none bg-gradient-to-r from-green-400 to-green-600 px-4 font-semibold text-white shadow-lg transition-all duration-300 hover:from-green-500 hover:to-green-700" 
                                disabled
                              >
                                PURCHASED
                              </motion.button>
                            )}
                          </div>
                        </div>

                        <Meta
                          avatar={<Avatar size={48} className="bg-blue-500 text-white">{course.instructor_name ? course.instructor_name[0] : "U"}</Avatar>}
                          title={<span className="line-clamp-1 text-lg font-semibold text-gray-800">{course.instructor_name}</span>}
                          description={
                            <motion.div 
                              className="h-25 mb-4 items-center text-sm"
                              initial={{ opacity: 0 }}
                              animate={{ opacity: 1 }}
                              transition={{ delay: 0.3 }}
                            >
                              <div>
                                <Tag className="bg-gradient-tone mr-2 rounded px-2 py-1 text-xs font-semibold uppercase text-white">{course.category_name}</Tag>
                              </div>
                              <div className="mt-4 flex items-center space-x-4">
                                <motion.span 
                                  className="flex items-center font-medium text-gray-600"
                                  whileHover={{ scale: 1.1 }}
                                >
                                  <BookOutlined className="mr-2 text-indigo-500" />
                                  <span className="bg-gradient-to-r from-indigo-500 to-purple-500 bg-clip-text text-transparent">{course.session_count} Sessions</span>
                                </motion.span>
                                <motion.span 
                                  className="flex items-center font-medium text-gray-600"
                                  whileHover={{ scale: 1.1 }}
                                >
                                  <VideoCameraOutlined className="mr-2 text-indigo-500" />
                                  <span className="bg-gradient-to-r from-indigo-500 to-purple-500 bg-clip-text text-transparent">{course.lesson_count} Lessons</span>
                                </motion.span>
                                <motion.span 
                                  className="flex items-center font-medium text-gray-600"
                                  whileHover={{ scale: 1.1 }}
                                >
                                  <ClockCircleOutlined className="mr-2 text-indigo-500" />
                                  <span className="bg-gradient-to-r from-indigo-500 to-purple-500 bg-clip-text text-transparent">{course.full_time} min</span>
                                </motion.span>
                              </div>
                            </motion.div>
                          }
                          className="mb-4"
                        />
                      </div>

                      <motion.div 
                        variants={buttonVariants}
                        className="absolute inset-x-0 bottom-0 h-12"
                      >
                        <Button 
                          type="primary" 
                          block 
                          size="large" 
                          className="bg-gradient-tone hover:bg-gradient-tone-hover border-none"
                          onClick={() => navigate(`/course/${course._id}`, { state: { triggerHover: true } })}
                        >
                          Preview This Course
                        </Button>
                      </motion.div>
                    </Card>
                  </motion.div>
                </motion.div>
              </Col>
            );
          })
        )}
      </AnimatePresence>
    </Row>
  );
};

export default Courses;
