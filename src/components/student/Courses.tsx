import React, { useState, useContext, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Typography, Card, Row, Col, Button, Tag, Avatar, Rate } from 'antd';
import { CrownOutlined, BookOutlined, PercentageOutlined } from '@ant-design/icons';
import coursesData from '../../data/courses.json';
import { Course } from '../../models/Course';
import { AuthContext } from '../../context/AuthContext';
import { User } from '../../models/User';
import { motion, AnimatePresence } from 'framer-motion';
const { Title, Paragraph } = Typography;
const { Meta } = Card;
import usersData from '../../data/users.json';
import PageNumber from '../generic/PageNumber';

const Courses: React.FC = () => {
  const { user: _user } = useContext(AuthContext);
  const [currentPage, setCurrentPage] = useState(1);
  const pageSize = 6;
  const totalCourses = coursesData.courses.length;
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsVisible(true);
    }, 500);
    return () => clearTimeout(timer);
  }, []);

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
    setIsVisible(false);
    setTimeout(() => setIsVisible(true), 300);
  };

  const paginatedCourses = coursesData.courses.slice(
    (currentPage - 1) * pageSize,
    currentPage * pageSize
  );

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: {
        type: 'spring',
        stiffness: 100
      }
    }
  };

  return (
    <>
      <motion.section 
        className="bg-gradient-to-b from-indigo-50 to-white py-16"
        initial={{ opacity: 0, y: -50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <Title level={2} className="text-5xl font-bold text-indigo-900 mb-12 text-center">
          <motion.span
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2, duration: 0.5 }}
          >
            Exclusive Courses
          </motion.span>
        </Title>
        <AnimatePresence>
          {isVisible && (
            <motion.div
              variants={containerVariants}
              initial="hidden"
              animate="visible"
              exit="hidden"
            >
              <Row gutter={[32, 32]}>
                {paginatedCourses.map((course: Course) => {
                  const instructor = usersData.users.find(user => user.id === course.user_id) as unknown as User;
                  const discountedPrice = (course.price - (course.price * course.discount / 100)).toFixed(2);
                  return (
                    <Col xs={24} sm={12} md={8} key={course.id}>
                      <motion.div variants={itemVariants}>
                        <Card
                          hoverable
                          cover={<img alt={course.name} src={course.image_url} className="h-48 object-cover" />}
                          className="h-full flex flex-col shadow-lg hover:shadow-xl transition-all duration-300 bg-white rounded-lg overflow-hidden relative group"
                        >
                          <motion.div 
                            className="absolute top-0 right-0 bg-[#8529ff] text-white px-3 py-1 rounded-bl-lg"
                            whileHover={{ scale: 1.05 }}
                          >
                            <CrownOutlined className="mr-1" />
                            {course.status === 'PUBLISHED' ? 'Premium' : 'Draft'}
                          </motion.div>
                          {course.discount > 0 && (
                            <motion.div 
                              className="absolute top-0 left-0 bg-[#8529ff] text-white px-3 py-1 rounded-br-lg"
                              whileHover={{ scale: 1.05 }}
                            >
                              <PercentageOutlined className="mr-1" />
                              {course.discount}% OFF
                            </motion.div>
                          )}
                          <Meta
                            avatar={<Avatar src={instructor.avatar_url} />}
                            title={<span className="text-lg font-semibold text-gray-800">{instructor.name}</span>}
                            description={
                              <div className="flex items-center text-sm mb-4">
                                <Tag className="mr-2 text-white bg-[#8529ff] px-2 py-1 rounded text-xs font-semibold uppercase">
                                  {course.category_id.replace('_', ' ')}
                                </Tag>
                                <div className="flex items-center">
                                  <BookOutlined className="mr-1 text-gray-600" />
                                  <span className="text-sm text-gray-600">{course.content.split(' ').length} lessons</span>
                                </div>
                              </div>
                            }
                            className="mb-4"
                          />
                          <Title level={4} className="text-xl font-bold text-gray-800 mb-2">{course.name}</Title>
                          <Paragraph className="text-gray-600 mb-4" ellipsis={{ rows: 2, expandable: false }}>
                            {course.description.slice(0, 40)}
                          </Paragraph>
                          <div className="mt-auto">
                            <div className="flex justify-between items-center mb-4">
                              <span className="text-2xl font-bold text-purple-700">${discountedPrice}</span>
                              {course.discount > 0 && (
                                <span className="text-lg line-through text-gray-500">${course.price}</span>
                              )}
                              <Rate disabled defaultValue={4.5} className="text-yellow-400" />
                            </div>
                            <motion.div 
                              className="absolute inset-x-0 bottom-0 transform translate-y-full transition-all duration-300 group-hover:translate-y-0"
                              whileHover={{ scale: 1.05 }}
                            >
                              <Link to={`/courses/${course.id}`}>
                                <Button type="primary" block size="large" className="bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700 border-none">
                                  Preview This Course
                                </Button>
                              </Link>
                            </motion.div>
                          </div>
                        </Card>
                      </motion.div>
                    </Col>
                  );
                })}
              </Row>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.section>

      <div className="mt-12 flex justify-center">
        <PageNumber
          currentPage={currentPage}
          total={totalCourses}
          pageSize={pageSize}
          onChange={handlePageChange}
        />
      </div>

      <motion.section 
        className="mt-24 text-center bg-gradient-to-b from-indigo-50 to-white py-16"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5 }}
      >
        <motion.div
          initial={{ y: 50, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.2, duration: 0.5 }}
        >
          <Title level={2} className="text-5xl font-bold text-indigo-900 mb-8">
            Elevate Your Expertise
          </Title>
          <Link to="/courses">
            <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
              <Button type="primary" size="large" className="bg-gradient-to-r from-[#ffd700] to-[#ffa500] hover:from-[#ffcc00] hover:to-[#ff9500] text-indigo-900 font-medium py-2 px-4 lg:px-6 rounded-full text-sm transition-all duration-200 ease-in-out shadow-md hover:shadow-lg hidden lg:inline-block">
                Explore All Premium Courses
              </Button>
            </motion.div>
          </Link>
        </motion.div>
      </motion.section>
    </>
  );
};

export default Courses;
