import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { Typography, Card, Row, Col, Button, Tag, Avatar, Rate } from "antd";
import { BookOutlined, PercentageOutlined, VideoCameraOutlined } from "@ant-design/icons";
import { motion } from "framer-motion";
import { GetPublicCourseResponse } from "../../../../models/api/responsive/course/course.response.model";
// import { User } from "../../../../models/api/responsive/users/users.model";
// import { GetCategoryResponse } from "../../../../models/api/responsive/admin/category.responsive.model";
import { CourseService } from "../../../../services/course/course.service";
import { UserService } from "../../../../services/admin/user.service";
import { helpers } from "../../../../utils";
import { useCart } from "../../../../contexts/CartContext";
const { Title, Paragraph } = Typography;
const { Meta } = Card;
import parse from "html-react-parser";

interface CoursesProps {
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

const Courses: React.FC<CoursesProps> = () => {

  const [courses, setCourses] = useState<GetPublicCourseResponse | null>(null);
  const [users, setUsers] = useState<{ [key: string]: any }>({});
  const { isCoursePurchased } = useCart();

  useEffect(() => {
    const fetchCourses = async () => {
      try {
        const coursesData = await fetchCoursePublic();
        setCourses(coursesData.data);

        // Fetch user details for each course
        const userPromises = coursesData.data.pageData.map(async (course) => {
          const userData = await UserService.getUserDetails(course.instructor_id);
          return { courseId: course._id, user: userData.data.data };
        });

        const usersData = await Promise.all(userPromises);
        const usersMap = usersData.reduce((acc: { [key: string]: any }, { courseId, user }) => { //debug
          acc[courseId as string] = user;
          return acc;
        }, {});

        setUsers(usersMap);
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
      {courses?.pageData.map((course) => {
        const { purchased, isInCart } = isCoursePurchased(course._id);
        const user = users[course._id]; // Get user details for the course
        console.log(`Course ID: ${course._id}, Purchased: ${purchased}, Is in cart: ${isInCart}`);
        return (
          <Col xs={24} sm={12} md={8} key={course._id} className="mx-auto h-full">
            <motion.div variants={itemVariants} className="h-full">
              <Card
                hoverable
                cover={<img alt={course.name} src={course.image_url} className="h-48 w-full object-cover" />}
                className={`group relative flex h-full flex-col overflow-hidden rounded-lg bg-white shadow-lg transition-all duration-300 hover:shadow-xl ${purchased ? 'border-green-500' : ''} ${isInCart ? 'border-blue-500' : ''}`}
                style={{
                  height: "100%",
                  display: "flex",
                  flexDirection: "column"
                }}
              >
                {purchased && (
                  <div className="absolute right-0 top-0 rounded-bl-lg bg-green-500 px-3 py-1 text-white">
                    Purchased
                  </div>
                )}
                {/* {isInCart && !purchased && (
                  <div className="absolute right-0 top-0 rounded-bl-lg bg-blue-500 px-3 py-1 text-white">
                    In Cart
                  </div>
                )} */}
                {course.discount > 0 && (
                  <motion.div className="absolute left-0 top-0 rounded-br-lg bg-gradient-tone px-3 py-1 text-white" whileHover={{ scale: 1.05 }}>
                    <PercentageOutlined className="mr-1" />
                    {course.discount}% OFF
                  </motion.div>
                )}
                <div className="flex h-full flex-col">
                  <Meta
                    avatar={<Avatar src={user?.avatar_url} />}
                    title={<span className="line-clamp-1 text-lg font-semibold text-gray-800">{user?.name}</span>}
                    description={
                      <div className="mb-4 flex items-center text-sm">
                        <Tag className="mr-2 rounded bg-gradient-tone px-2 py-1 text-xs font-semibold uppercase text-white">{course.category_name}</Tag>
                        <div className="flex items-center space-x-4">
                          <span className="flex items-center text-gray-600 font-medium">
                            <BookOutlined className="mr-2 text-indigo-500" />
                            <span className="bg-gradient-to-r from-indigo-500 to-purple-500 bg-clip-text text-transparent">
                              {course.session_count} Sessions
                            </span>
                          </span>
                          <span className="flex items-center text-gray-600 font-medium">
                            <VideoCameraOutlined className="mr-2 text-indigo-500" />
                            <span className="bg-gradient-to-r from-indigo-500 to-purple-500 bg-clip-text text-transparent">
                              {course.lesson_count} Lessons
                            </span>
                          </span>
                        </div>
                      </div>
                    }
                    className="mb-4"
                  />
                  <Title level={4} className="mb-2 line-clamp-2 h-14 text-xl font-bold text-gray-800">
                    {course.name}
                  </Title>
                  <Paragraph className="h-18 mb-4 line-clamp-3 flex-grow text-gray-600">{parse(course.description)}</Paragraph>
                  <div className="mt-auto">
                    <div className="mb-4 flex items-center justify-between">
                      <span className="text-2xl font-bold text-indigo-800">${helpers.moneyFormat(course.price * (1 - course.discount / 100))}</span>
                      {course.discount > 0 && <span className="text-lg text-gray-500 line-through">${helpers.moneyFormat(course.price)}</span>}
                      <Rate disabled defaultValue={4.5} className="text-yellow-400" count={5} />
                    </div>
                  </div>
                </div>
                <motion.div className="absolute inset-x-0 bottom-0 translate-y-full transform transition-all duration-300 group-hover:translate-y-0" whileHover={{ scale: 1.05 }}>
                  <Link to={`/course/${course._id}`}>
                    <Button type="primary" block size="large" className="border-none bg-gradient-tone hover:bg-gradient-tone-hover">
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
