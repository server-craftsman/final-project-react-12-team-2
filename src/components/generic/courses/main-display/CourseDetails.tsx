import React, { useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import coursesData from '../../../../data/courses.json';
import usersData from '../../../../data/users.json';
import categoriesData from '../../../../data/categories.json';
import reviewsData from '../../../../data/reviews.json';
import sessionsData from '../../../../data/sessions.json';
import lessonsData from '../../../../data/lessons.json';

import { HomeOutlined, InfoCircleOutlined, StarOutlined, BookOutlined } from '@ant-design/icons';
import { Card, Row, Col, Divider, Tabs } from 'antd';

//==========connect components==========
//tabs
import CourseInsights from '../tabs-course/CourseInsights';
import CourseContent from '../tabs-course/CourseContent';
import CourseReviews from '../tabs-course/CourseReviews';

//subs
import CourseHeader from '../subs-course/CourseHeader';
import CourseSidebar from '../subs-course/CourseSidebar';
import CourseVideoModal from '../subs-course/CourseVideoModal';
//=====================================

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
      children: <CourseInsights course={course} instructor={instructor} />,
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
        <CourseContent 
          sessions={sessions} 
          lessons={lessons} 
          courseId={course.id} 
          activeSessionId={activeSessionId} 
          setActiveSessionId={setActiveSessionId} 
        />
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
      children: <CourseReviews reviews={reviews} users={usersData.users} />,
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
            <Card className="shadow-lg rounded-lg overflow-hidden text-left">
              <CourseHeader
                course={course}
                category={category}
                instructor={instructor}
                showVideoModal={showVideoModal}
              />
              <div className="p-6 text-left">
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
            <CourseSidebar
              course={course}
              discountedPrice={discountedPrice}
            />
          </Col>
        </Row>
      </div>
      <CourseVideoModal
        isModalVisible={isModalVisible}
        handleCancel={handleCancel}
        videoId={videoId}
      />
    </div>
  );
};

export default CourseDetails;