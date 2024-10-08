import React from 'react';
import { Link } from 'react-router-dom';
import { Typography, Card, Row, Col, Button, Tag, Avatar, Rate } from 'antd';
import { CrownOutlined, BookOutlined, PercentageOutlined } from '@ant-design/icons';
import { Course } from '../../models/Course';
import { User } from '../../models/User';
import { motion } from 'framer-motion';

const { Title, Paragraph } = Typography;
const { Meta } = Card;

interface CoursesProps {
  courses: Course[];
  usersData: { users: User[] };
}

const Courses: React.FC<CoursesProps> = ({ courses, usersData }) => {
  if (courses.length === 0) {
    return <div>No courses available.</div>;
  }

  const instructor = usersData.users.find(user => user.id === courses[0].user_id) as User;
  const discountedPrice = (courses[0].price - (courses[0].price * courses[0].discount / 100)).toFixed(2);

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
    <Row gutter={[32, 32]}>
      {courses.map((course: Course) => {
        return (
          <Col xs={24} sm={12} md={8} key={course.id} className="h-full mx-auto">
            <motion.div variants={itemVariants} className="h-full">
              <Card
                hoverable
                cover={<img alt={course.name} src={course.image_url} className="h-48 object-cover w-full" />}
                className="h-full flex flex-col shadow-lg hover:shadow-xl transition-all duration-300 bg-white rounded-lg overflow-hidden relative group"
                style={{ height: '100%', display: 'flex', flexDirection: 'column' }}
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
                <div className="flex flex-col h-full">
                  <Meta
                    avatar={<Avatar src={instructor.avatar_url} />}
                    title={<span className="text-lg font-semibold text-gray-800 line-clamp-1">{instructor.name}</span>}
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
                  <Title level={4} className="text-xl font-bold text-gray-800 mb-2 line-clamp-2 h-14">{course.name}</Title>
                  <Paragraph className="text-gray-600 mb-4 flex-grow line-clamp-3 h-18">
                    {course.description}
                  </Paragraph>
                  <div className="mt-auto">
                    <div className="flex justify-between items-center mb-4">
                      <span className="text-2xl font-bold text-purple-700">${discountedPrice}</span>
                      {course.discount > 0 && (
                        <span className="text-lg line-through text-gray-500">${course.price}</span>
                      )}
                      <Rate disabled defaultValue={4.5} className="text-yellow-400" />
                    </div>
                  </div>
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
              </Card>
            </motion.div>
          </Col>
        );
      })}
    </Row>
  );
};

export default Courses;