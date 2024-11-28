import React, { useState, useEffect } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import { MenuOutlined, CloseOutlined } from "@ant-design/icons";
import { Button, Card, Row, Col, Typography, Breadcrumb, Menu, Divider } from "antd";
import { LessonService } from "../../../services/lesson/lesson.service";
import { GetPublicCourseDetailResponse } from "../../../models/api/responsive/course/course.response.model";
import { LessonDetailsResponse } from "../../../models/api/responsive/lesson/lesson.response.model";
const { Title, Paragraph, Text } = Typography;
import parse from "html-react-parser";
import { CourseService } from "../../../services/course/course.service";
import { LessonType } from "../../../app/enums";

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
        const response = await CourseService.getPublicCourseDetail(courseId || "");
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
      <Menu mode="inline" className="w-full border-none" style={{ maxHeight: "70vh", overflowY: "auto", padding: "0px" }}>
        {sessions.map((session) => (
          <Menu.SubMenu
            key={session._id}
            title={
              <div className="flex items-center justify-between w-full">
                <span className="font-semibold text-[#1a237e]">{session.name}</span>
              </div>
            }
          >
            {session.lesson_list
              .sort((a: any, b: any) => a.position_order - b.position_order)
              .map((lesson: any) => (
                <Menu.Item key={lesson._id} className="py-3">
                  <Link 
                    to={`/course/${course?._id}/lesson/${lesson._id}`} 
                    className="flex items-center text-gray-700 hover:text-[#1a237e] gap-2"
                    title={lesson.name}
                  >
                    {lesson.lesson_type === LessonType.VIDEO ? (
                      <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-6">
                        <path strokeLinecap="round" strokeLinejoin="round" d="m15.75 10.5 4.72-4.72a.75.75 0 0 1 1.28.53v11.38a.75.75 0 0 1-1.28.53l-4.72-4.72M4.5 18.75h9a2.25 2.25 0 0 0 2.25-2.25v-9a2.25 2.25 0 0 0-2.25-2.25h-9A2.25 2.25 0 0 0 2.25 7.5v9a2.25 2.25 0 0 0 2.25 2.25Z" />
                      </svg>
                    
                    ) : lesson.lesson_type === LessonType.IMAGE ? (
                      <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-6">
                        <path strokeLinecap="round" strokeLinejoin="round" d="m2.25 15.75 5.159-5.159a2.25 2.25 0 0 1 3.182 0l5.159 5.159m-1.5-1.5 1.409-1.409a2.25 2.25 0 0 1 3.182 0l2.909 2.909m-18 3.75h16.5a1.5 1.5 0 0 0 1.5-1.5V6a1.5 1.5 0 0 0-1.5-1.5H3.75A1.5 1.5 0 0 0 2.25 6v12a1.5 1.5 0 0 0 1.5 1.5Zm10.5-11.25h.008v.008h-.008V8.25Zm.375 0a.375.375 0 1 1-.75 0 .375.375 0 0 1 .75 0Z" />
                      </svg>
                    ) : (
                      <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-6">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 14.25v-2.625a3.375 3.375 0 0 0-3.375-3.375h-1.5A1.125 1.125 0 0 1 13.5 7.125v-1.5a3.375 3.375 0 0 0-3.375-3.375H8.25m0 12.75h7.5m-7.5 3H12M10.5 2.25H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 0 0-9-9Z" />
                      </svg>
                    )}
                    <span className="truncate hover:text-clip">{lesson.name}</span>
                  </Link>
                </Menu.Item>
              ))}
          </Menu.SubMenu>
        ))}
      </Menu>
    );
  };

  const breadcrumbItems = [{ title: <Link to="/">Home</Link> }, { title: <Link to={`/course/${course?._id}`}>{course?.name}</Link> }, { title: lesson?.name }];

  return (
    <div className="min-h-screen bg-gray-100 py-12">
      <div className="container mx-auto px-4">
        <div className="mb-6 flex items-center">
          <Button icon={menuCollapsed ? <MenuOutlined /> : <CloseOutlined />} onClick={toggleMenu} type="text" className="mr-4 text-gray-600" />
          <Breadcrumb items={breadcrumbItems} className="flex-grow" />
        </div>

        <Row gutter={[32, 32]}>
          {!menuCollapsed && (
            <Col xs={24} lg={8}>
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
          <Col xs={24} lg={menuCollapsed ? 24 : 16}>
            <Card className="mb-8 overflow-hidden rounded-lg shadow-lg">
              <div className="p-6">
                {/* <Tag color="blue" className="mb-4 bg-[#1a237e] text-white">
                </Tag> */}
                <Divider className="mb-4 border-[#1a237e]" />
                <Title level={2} className="mb-4">
                  {lesson?.name}
                </Title>
                {!lesson?.description && (
                  <div className="relative mb-6 aspect-video overflow-hidden rounded-lg shadow-2xl">
                    {lesson?.video_url ? (
                      <>
                        <video controls className="h-full w-full">
                          <source src={lesson.video_url} type="video/mp4" />
                          Your browser does not support the video tag.
                        </video>
                      </>
                    ) : lesson?.image_url ? (
                      <>
                        <img src={lesson.image_url} alt={lesson.name} className="h-full w-full object-cover" />
                      </>
                    ) : null}
                  </div>
                )}
                <Paragraph className="mb-6 text-gray-600">{parse(lesson?.description || "")}</Paragraph>
                <div className="mb-6 flex items-center">{/* Instructor details and other information can be added here */}</div>
              </div>
            </Card>
            <Row gutter={[32, 32]}>
              <Col xs={24} lg={24}>
                <Card className="rounded-lg shadow-lg">
                  <Title level={4} className="mb-4">
                    Lesson Content
                  </Title>
                  <Row gutter={[16, 16]}>
                    {lesson?.lesson_type === LessonType.VIDEO && (
                      <Col xs={12} sm={8}>
                        <Card className="text-center transition-shadow duration-300 hover:shadow-2xl border border-[#1a237e] rounded-lg p-4 flex flex-col items-center">
                          <React.Fragment>
                            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-6 text-[#1a237e] mb-2 ml-7">
                              <path strokeLinecap="round" strokeLinejoin="round" d="m15.75 10.5 4.72-4.72a.75.75 0 0 1 1.28.53v11.38a.75.75 0 0 1-1.28.53l-4.72-4.72M4.5 18.75h9a2.25 2.25 0 0 0 2.25-2.25v-9a2.25 2.25 0 0 0-2.25-2.25h-9A2.25 2.25 0 0 0 2.25 7.5v9a2.25 2.25 0 0 0 2.25 2.25Z" />
                            </svg>
                            <Text className="block text-gray-500">Video Length</Text>
                            <Text strong className="text-lg">
                              {lesson?.full_time} min
                            </Text>
                          </React.Fragment>
                        </Card>
                      </Col>
                    )}

                    <Col xs={24} sm={lesson?.lesson_type === LessonType.VIDEO ? 8 : 24}>
                      <Card className="text-center transition-shadow duration-300 hover:shadow-2xl border border-[#1a237e] rounded-lg p-4 flex flex-col items-center">
                        {lesson?.lesson_type === LessonType.VIDEO ? (
                          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-6 text-[#1a237e] mb-2 mx-auto">
                            <path strokeLinecap="round" strokeLinejoin="round" d="m15.75 10.5 4.72-4.72a.75.75 0 0 1 1.28.53v11.38a.75.75 0 0 1-1.28.53l-4.72-4.72M4.5 18.75h9a2.25 2.25 0 0 0 2.25-2.25v-9a2.25 2.25 0 0 0-2.25-2.25h-9A2.25 2.25 0 0 0 2.25 7.5v9a2.25 2.25 0 0 0 2.25 2.25Z" />
                          </svg>
                        ) : lesson?.lesson_type === LessonType.IMAGE ? (
                          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-6 text-[#1a237e] mb-2 mx-auto">
                            <path strokeLinecap="round" strokeLinejoin="round" d="m2.25 15.75 5.159-5.159a2.25 2.25 0 0 1 3.182 0l5.159 5.159m-1.5-1.5 1.409-1.409a2.25 2.25 0 0 1 3.182 0l2.909 2.909m-18 3.75h16.5a1.5 1.5 0 0 0 1.5-1.5V6a1.5 1.5 0 0 0-1.5-1.5H3.75A1.5 1.5 0 0 0 2.25 6v12a1.5 1.5 0 0 0 1.5 1.5Zm10.5-11.25h.008v.008h-.008V8.25Zm.375 0a.375.375 0 1 1-.75 0 .375.375 0 0 1 .75 0Z" />
                          </svg>
                        ) : (
                          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-6 text-[#1a237e] mb-2 mx-auto">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 14.25v-2.625a3.375 3.375 0 0 0-3.375-3.375h-1.5A1.125 1.125 0 0 1 13.5 7.125v-1.5a3.375 3.375 0 0 0-3.375-3.375H8.25m0 12.75h7.5m-7.5 3H12M10.5 2.25H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 0 0-9-9Z" />
                          </svg>
                        )}
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
