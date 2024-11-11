import React, { useState, useEffect } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import { PlayCircleOutlined, FileTextOutlined, MenuOutlined, CloseOutlined } from "@ant-design/icons";
import { Button, Card, Row, Col, Typography, Tag, Breadcrumb, Menu } from "antd";
import { LessonService } from "../../../services/lesson/lesson.service";
import { GetPublicCourseDetailResponse } from "../../../models/api/responsive/course/course.response.model";
import { LessonDetailsResponse } from "../../../models/api/responsive/lesson/lesson.response.model";
const { Title, Paragraph, Text } = Typography;
import parse from "html-react-parser";
import { CourseService } from "../../../services/course/course.service";

// Add this utility function to validate ObjectId
const isValidObjectId = (id: string) => /^[a-f\d]{24}$/i.test(id);

const LessonDetails: React.FC = () => {
  const { courseId, lessonId } = useParams<{
    courseId: string;
    lessonId: string;
  }>();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [menuCollapsed, setMenuCollapsed] = useState(false);
  const [lesson, setLesson] = useState<LessonDetailsResponse | null>(null);
  const [course, setCourse] = useState<GetPublicCourseDetailResponse | null>(null);

  // Validate the lessonId
  if (!lessonId || !isValidObjectId(lessonId)) {
    return <div className="mt-8 text-center text-2xl">Invalid lesson ID</div>;
  }

  useEffect(() => {
    const fetchLessonDetails = async () => {
      try {
        const response = await LessonService.getLessonDetails(lessonId);
        setLesson(response.data.data);
        setLoading(false);
      } catch (err) {
        setError("Failed to load lesson details.");
        setLoading(false);
      }
    };

    if (lessonId) {
      fetchLessonDetails();
    }
  }, [lessonId]);

  useEffect(() => {
    const fetchCourseDetails = async () => {
      try {
        const response = await CourseService.getPublicCourseDetail(courseId || '');
        setCourse(response.data.data);
      } catch (err) {
        setError("Failed to load course details.");
      }
    };

    if (courseId) {
      fetchCourseDetails();
    }
  }, [courseId]);

  if (loading) {
    return <div className="mt-8 text-center text-2xl">Loading...</div>;
  }

  if (error) {
    return (
      <div className="mt-8 text-center">
        <div className="mb-4 text-2xl">{error}</div>
        <Button onClick={() => navigate(`/course/${courseId}`)}>Back to Course</Button>
      </div>
    );
  }

  const toggleMenu = () => {
    setMenuCollapsed(!menuCollapsed);
  };
  const renderLessonMenu = (sessions: any[] | undefined) => {
    if (!sessions) return null;

    return (
      <Menu 
        mode="inline" 
        className="w-full border-none"
        style={{ maxHeight: '70vh', overflowY: 'auto' }}
      >
        {sessions.map((session) => (
          <Menu.SubMenu
            key={session._id}
            title={
              <span className="font-semibold text-[#1a237e]">{session.name}</span>
            }
            // className="border-b border-gray-200"
          >
            {session.lesson_list
              .sort((a: any, b: any) => a.position_order - b.position_order)
              .map((lesson: any) => (
                <Menu.Item 
                  key={lesson._id}
                  className="py-3"
                >
                  <Link 
                    to={`/course/${course?._id}/lesson/${lesson._id}`}
                    className="flex items-center text-gray-700 hover:text-[#1a237e]"
                  >
                    <PlayCircleOutlined className="mr-2" />
                    {lesson.name}
                  </Link>
                </Menu.Item>
              ))}
          </Menu.SubMenu>
        ))}
      </Menu>
    );
  };

  const breadcrumbItems = [
    { title: <Link to="/">Home</Link> },
    { title: <Link to={`/course/${course?._id}`}>{course?.name}</Link> },
    { title: lesson?.name }
  ];

  return (
    <div className="min-h-screen bg-gray-100 py-12">
      <div className="container mx-auto px-4">
        <div className="mb-6 flex items-center">
          <Button
            icon={menuCollapsed ? <MenuOutlined /> : <CloseOutlined />}
            onClick={toggleMenu}
            type="text"
            className="mr-4 text-gray-600"
          />
          <Breadcrumb items={breadcrumbItems} className="flex-grow" />
        </div>

        <Row gutter={[32, 32]}>
          {!menuCollapsed && (
            <Col xs={24} lg={6}>
              <Card className="mb-8 overflow-hidden rounded-lg shadow-lg">
                <div className="mb-4 flex items-center justify-between">
                  <Title level={4} className="mb-0">
                    Course Content
                  </Title>
                </div>
                {renderLessonMenu(course?.session_list)}
              </Card>
            </Col>
          )}
          <Col xs={24} lg={menuCollapsed ? 24 : 18}>
            <Card className="mb-8 overflow-hidden rounded-lg shadow-lg">
              <div className="p-6">
                <Tag color="blue" className="mb-4 bg-[#1a237e] text-white">
                  {lesson?.session_name}
                </Tag>
                <Title level={2} className="mb-4">
                  {lesson?.name}
                </Title>
                <div className="relative mb-6 aspect-video overflow-hidden rounded-lg shadow-2xl">
                  {lesson?.video_url ? (
                    <video controls className="w-full h-full">
                      <source src={lesson.video_url} type="video/mp4" />
                      Your browser does not support the video tag.
                    </video>
                  ) : lesson?.image_url ? (
                    <img src={lesson.image_url} alt={lesson.name} className="w-full h-full object-cover" />
                  ) : (
                    <div className="p-4 text-white bg-gradient-to-t from-black to-transparent">
                      {lesson?.description}
                    </div>
                  )}
                </div>
                <Paragraph className="mb-6 text-gray-600">{parse(lesson?.description || "")}</Paragraph>
                <div className="mb-6 flex items-center">
                  {/* Instructor details and other information can be added here */}
                </div>
              </div>
            </Card>
            <Row gutter={[32, 32]}>
              <Col xs={24} lg={24}>
                <Card className="rounded-lg shadow-lg">
                  <Title level={4} className="mb-4">
                    Lesson Content
                  </Title>
                  <Row gutter={[16, 16]}>
                    <Col xs={12} sm={8}>
                      <Card className="text-center transition-shadow duration-300 hover:shadow-lg">
                        <PlayCircleOutlined className="mb-2 text-4xl text-blue-500" />
                        <Text className="block text-gray-500">Video Length</Text>
                        <Text strong className="text-lg">
                          {lesson?.full_time} min
                        </Text>
                      </Card>
                    </Col>
                    
                    <Col xs={12} sm={8}>
                      <Card className="text-center transition-shadow duration-300 hover:shadow-lg">
                        <FileTextOutlined className="mb-2 text-4xl text-blue-500" />
                        <Text className="block text-gray-500">Lesson Type</Text>
                        <Text strong className="text-lg">
                          {lesson?.lesson_type}
                        </Text>
                      </Card>
                    </Col>
                  </Row>
                </Card>
              </Col>
            </Row>
          </Col>
        </Row>
      </div>
    </div>
  );
};

export default LessonDetails;
