import React, { useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import coursesData from '../../../data/courses.json';
import usersData from '../../../data/users.json';
import categoriesData from '../../../data/categories.json';
import reviewsData from '../../../data/reviews.json';
import sessionsData from '../../../data/sessions.json';
import lessonsData from '../../../data/lessons.json';

import { PlayCircleOutlined, ClockCircleOutlined, FileTextOutlined, TrophyOutlined, ShoppingCartOutlined, HomeOutlined, InfoCircleOutlined, StarOutlined, BookOutlined, BarChartOutlined, GlobalOutlined, CalendarOutlined, ShareAltOutlined } from '@ant-design/icons';
import { Button, Tag, Card, Row, Col, Typography, Divider, Modal, Tabs, Rate, List, Collapse } from 'antd';
import { motion } from 'framer-motion';

const { Title, Paragraph, Text } = Typography;

const CourseDetails: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const course = coursesData.courses.find(course => course.id === id);
  const instructor = usersData.users.find(user => user.id === course?.user_id);
  const discountedPrice = ((course?.price ?? 0) - ((course?.price ?? 0) * (course?.discount ?? 0) / 100)).toFixed(2);
  const category = categoriesData.categories.find(category => category.id === course?.category_id);

  const [isModalVisible, setIsModalVisible] = useState(false);

  // Add this new state
  const [activeSessionId, setActiveSessionId] = useState<string | null>(null);

  const reviews = reviewsData.reviews.filter(review => review.course_id === id);
  const sessions = sessionsData.sessions.filter(session => session.course_id === id);
  const lessons = lessonsData.lessons.filter(lesson => lesson.course_id === id);

  if (!course) {
    return <div className="text-center text-2xl mt-8">Course not found</div>;
  }

  const showVideoModal = () => {
    setIsModalVisible(true);
  };

  const handleCancel = () => {
    setIsModalVisible(false);
  };

  // Function to extract YouTube video ID from URL
  const getYouTubeVideoId = (url: string) => {
    const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|\&v=)([^#\&\?]*).*/;
    const match = url.match(regExp);
    return (match && match[2].length === 11) ? match[2] : null;
  };

  const videoId = getYouTubeVideoId(course.video_url);

  const tabItems = [
    {
      key: '1',
      label: (
        <span className="tab-title bg-gradient-to-r from-[#8529ff] to-[#1a237e] text-white px-4 py-2 rounded-full shadow-md transition-all duration-300 hover:shadow-lg hover:scale-105">
          <InfoCircleOutlined className="mr-2 text-gold animate-pulse" />
          <span className="font-semibold tracking-wide">Course Insights</span>
        </span>
      ),
      children: (
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

        {/* process to overview instructor */}
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
      ),
    },
    {
      key: '2',
      label: (
        <span className="tab-title bg-gradient-to-r from-[#8529ff] to-[#1a237e] text-white px-4 py-2 rounded-full shadow-md transition-all duration-300 hover:shadow-lg hover:scale-105">
          <BookOutlined className="mr-2 text-gold animate-pulse" />
          <span className="font-semibold tracking-wide">Course Content</span>
        </span>
      ),
      children: (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          {sessions.map(session => (
            <Collapse
              key={session.id}
              className="mb-8 bg-gradient-to-r from-[#f3e7ff] to-[#e7f0ff] shadow-xl rounded-lg overflow-hidden border-2 border-[#8529ff]"
              activeKey={activeSessionId ?? undefined}
              onChange={(key) => setActiveSessionId(Array.isArray(key) ? key[0] : key)}
              items={[
                {
                  key: session.id,
                  label: (
                    <Title level={4} className="text-2xl font-bold text-[#1a237e] mb-0 pl-4 border-l-4 border-[#8529ff]">
                      {session.name}
                    </Title>
                  ),
                  children: (
                    <div>
                      <Paragraph>{session.description}</Paragraph>
                      <List
                        dataSource={lessons.filter(lesson => lesson.session_id === session.id)}
                        renderItem={lesson => (
                          <List.Item>
                            <Link to={`/course/${id}/session/${session.id}/lesson/${lesson.id}`} className="w-full">
                              <Button type="link" block className="text-left">
                                <PlayCircleOutlined className="mr-2" />
                                {lesson.name} ({lesson.full_time} min)
                              </Button>
                            </Link>
                          </List.Item>
                        )}
                      />
                    </div>
                  ),
                },
              ]}
            />
          ))}
        </motion.div>
      ),
    },
    {
        key: '3',
        label: (
          <span className="tab-title bg-gradient-to-r from-[#8529ff] to-[#1a237e] text-white px-4 py-2 rounded-full shadow-md transition-all duration-300 hover:shadow-lg hover:scale-105">
            <StarOutlined className="mr-2 text-gold animate-pulse" />
            <span className="font-semibold tracking-wide">Reviews</span>
          </span>
        ),
        children: (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            {reviews.length > 0 ? (
              reviews.map(review => (
                <Card key={review.id} className="mb-4">
                  <div className="flex items-center mb-2">
                    <Text strong>{usersData.users.find(user => user.id === review.user_id)?.name}</Text>
                    <Rate disabled defaultValue={review.rating} className="ml-2" />
                  </div>
                  <Paragraph>{review.comment}</Paragraph>
                </Card>
              ))
            ) : (
              <Paragraph>No reviews yet.</Paragraph>
            )}
          </motion.div>
        ),
      },
  ];

  return (
    <div className="bg-gray-100 min-h-screen py-12">
      <div className="container mx-auto px-4">
        <Link to="/" className="flex items-center text-blue-600 hover:text-blue-800 mb-6">
          <HomeOutlined className="mr-2" />
          <span>Back to Home</span>
        </Link>
        <Row gutter={[32, 32]}>
          <Col xs={24} lg={16}>
            <Card className="shadow-lg rounded-lg overflow-hidden">
              <div className="relative">
                <img
                  src={course.image_url}
                  alt={course.name}
                  className="w-full h-64 object-cover"
                />
                <div className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center">
                  <PlayCircleOutlined 
                    className="text-6xl text-white hover:text-blue-300 transition-colors duration-300 cursor-pointer"
                    onClick={showVideoModal}
                  />
                </div>
              </div>
              <div className="p-6">
                <Tag color="blue" className="mb-4">{category?.name}</Tag>
                <Title level={2} className="mb-4">{course.name}</Title>
                <Paragraph className="text-gray-600 mb-6">{course.description}</Paragraph>
                <div className="flex items-center mb-6">
                  <img src={instructor?.avatar_url} className="mr-2 w-12 h-12 rounded-full" />
                  <Text strong className="text-gray-700">{instructor?.name}</Text>
                </div>
                <Divider />
                <Tabs
                  defaultActiveKey="1"
                  className="custom-tabs"
                  animated={{ inkBar: true, tabPane: true }}
                  tabBarStyle={{ 
                    marginBottom: '24px',
                    borderBottom: '2px solid #f0f0f0'
                  }}
                  tabBarGutter={32}
                  items={tabItems}
                />
              </div>
            </Card>
          </Col>
          <Col xs={24} lg={8}>
            <Card className="shadow-lg rounded-lg sticky top-8">
              <div className="text-center mb-6">
                <Text className="text-3xl font-bold text-[#02005dc6]">${discountedPrice}</Text>
                {course.discount > 0 && (
                  <Text className="ml-2 text-lg line-through text-gray-500">${course.price}</Text>
                )}
              </div>
              <Button type="primary" size="large" block className="mb-4 h-12 text-lg bg-[#1a237e] text-white hover:bg-[#1a237e] hover:text-white" icon={<ShoppingCartOutlined />}>
                Add to cart
              </Button>
              <Button size="large" block className="mb-6 h-12 text-lg">
                Buy Course
              </Button>
              <Divider />
              <Title level={4} className="mb-4">This course includes:</Title>
              <div className="space-y-4">
                <div className="flex items-center">
                  <PlayCircleOutlined className="text-xl text-gray-600 mr-3" />
                  <div>
                    <Text strong>Lectures</Text>
                    <Text className="block text-gray-500">12</Text>
                  </div>
                </div>
                <div className="flex items-center">
                  <ClockCircleOutlined className="text-xl text-gray-600 mr-3" />
                  <div>
                    <Text strong>Duration</Text>
                    <Text className="block text-gray-500">20h 50m</Text>
                  </div>
                </div>
                <div className="flex items-center">
                  <BarChartOutlined className="text-xl text-gray-600 mr-3" />
                  <div>
                    <Text strong>Skill Level</Text>
                    <Text className="block text-gray-500">Beginner</Text>
                  </div>
                </div>
                <div className="flex items-center">
                  <GlobalOutlined className="text-xl text-gray-600 mr-3" />
                  <div>
                    <Text strong>Language</Text>
                    <Text className="block text-gray-500">English</Text>
                  </div>
                </div>
                <div className="flex items-center">
                  <CalendarOutlined className="text-xl text-gray-600 mr-3" />
                  <div>
                    <Text strong>Deadline</Text>
                    <Text className="block text-gray-500">February 20, 2025</Text>
                  </div>
                </div>
                <div className="flex items-center">
                  <TrophyOutlined className="text-xl text-gray-600 mr-3" />
                  <div>
                    <Text strong>Certificate</Text>
                    <Text className="block text-gray-500">Yes</Text>
                  </div>
                </div>
              </div>
              <Button icon={<ShareAltOutlined />} type="link" className="mt-4 p-0">
                Share this course
              </Button>
            </Card>
          </Col>
        </Row>
      </div>
      <Modal
        title="Course Video"
        open={isModalVisible}
        onCancel={handleCancel}
        footer={null}
        width={800}
      >
        {videoId ? (
          <div className="aspect-video">
            <iframe
              width="100%"
              height="100%"
            src={`https://www.youtube.com/embed/${videoId}`}
            title="Course Video"
            style={{ border: 'none' }}
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
            ></iframe>
          </div>
        ) : (
          <div>Video not available</div>
        )}
      </Modal>
    </div>
  );
};

export default CourseDetails;