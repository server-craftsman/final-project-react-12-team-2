import React from 'react';
import { Link } from 'react-router-dom';
import { Typography, Card, Row, Col, Button, Tag } from 'antd';
import { StarOutlined } from '@ant-design/icons';
import coursesData from '../../data/courses.json';
import { Course } from '../../models/Course';
const { Title, Paragraph } = Typography;
const { Meta } = Card;


const courses: Course[] = coursesData.courses;

const Courses: React.FC = () => {
  return (
    <>
       <section>
        <Title level={2} className="text-4xl font-semibold text-indigo-800 mb-8 text-center">
          Featured Courses
        </Title>
        <Row gutter={[24, 24]}>
          {courses.map((course: Course) => (
            <Col xs={24} sm={12} md={6} key={course.id}>
              <Card
                hoverable
                cover={<img alt={course.name} src={course.image_url} className="h-56 object-cover" />}
                className="h-full flex flex-col shadow-lg hover:shadow-xl transition-shadow duration-300"
              >
                <Meta
                  title={<span className="text-lg font-semibold text-indigo-800">{course.name}</span>}
                  description={
                    <>
                      <Paragraph className="text-gray-600 mb-2" ellipsis={{ rows: 2 }}>
                        {course.description}
                      </Paragraph>
                      <div className="flex justify-between items-center">
                        <Tag color="blue">{course.category_id.replace('_', ' ')}</Tag>
                        <div className="flex items-center">
                          <StarOutlined className="text-yellow-400 mr-1" />
                          <span className="font-semibold">{(Math.random() * 2 + 3).toFixed(1)}</span>
                        </div>
                      </div>
                      <div className="mt-4 flex justify-between items-center">
                        <span className="text-lg font-bold text-indigo-600">
                          ${course.price - (course.price * course.discount / 100)}
                        </span>
                        {course.discount > 0 && (
                          <span className="text-sm line-through text-gray-500">${course.price}</span>
                        )}
                      </div>
                    </>
                  }
                />
                <Button type="primary" className="mt-4 bg-indigo-600 hover:bg-indigo-700 border-none">
                  Enroll Now
                </Button>
              </Card>
            </Col>
          ))}
        </Row>
      </section>

      <section className="mt-16 text-center">
        <Title level={2} className="text-4xl font-semibold text-indigo-800 mb-6">
          Ready to Elevate Your Skills?
        </Title>
        <Link to="/courses">
          <Button type="primary" size="large" className="bg-indigo-600 hover:bg-indigo-700 border-none text-lg h-12 px-8">
            Explore All Courses
          </Button>
        </Link>
      </section>
    </>
  );
};

export default Courses;
