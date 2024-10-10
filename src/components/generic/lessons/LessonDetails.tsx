import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import lessonsData from '../../../data/lessons.json';
import coursesData from '../../../data/courses.json';
import usersData from '../../../data/users.json';
import sessionsData from '../../../data/sessions.json';
import { PlayCircleOutlined, ClockCircleOutlined, FileTextOutlined, MenuOutlined, CloseOutlined } from '@ant-design/icons';
import { Button, Card, Row, Col, Typography, Tag, Progress, Breadcrumb, Menu, Modal } from 'antd';
import YouTube from 'react-youtube';
import LessonSidebar from './LessonSidebar';
import { MenuFoldOutlined, MenuUnfoldOutlined } from '@ant-design/icons';

const { Title, Paragraph, Text } = Typography

const LessonDetails: React.FC = () => {
  const { courseId, sessionId, lessonId } = useParams<{ courseId: string, sessionId: string, lessonId: string }>();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [player, setPlayer] = useState<any>(null);
  const [openKeys, setOpenKeys] = useState<string[]>([]);
  const [menuCollapsed, setMenuCollapsed] = useState(false);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [sidebarVisible, setSidebarVisible] = useState(true);
  const lesson = lessonsData.lessons.find((lesson) => lesson.id === lessonId);
  const course = coursesData.courses.find((course) => course.id === courseId);
  const session = sessionsData.sessions.find((session) => session.id === sessionId);
  const instructor = usersData.users.find((user) => user.id === lesson?.user_id);

  const allSessions = sessionsData.sessions.filter((session) => session.course_id === courseId);
  const allLessons = lessonsData.lessons.filter((lesson) => lesson.course_id === courseId);

  useEffect(() => {
    if (!lesson || !course) {
      setError('Lesson, course, or session not found');
    }
    setLoading(false);
  }, [lesson, course, session]);

  useEffect(() => {
    if (player) {
      player.pauseVideo();
    }
  }, [lessonId]);

  if (loading) {
    return <div className="text-center text-2xl mt-8">Loading...</div>;
  }

  if (error) {
    return (
      <div className="text-center mt-8">
        <div className="text-2xl mb-4">{error}</div>
        <Button onClick={() => navigate(`/course/${courseId}`)}>Back to Course</Button>
      </div>
    );
  }

  const getYouTubeVideoId = (url: string) => {
    const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|\&v=)([^#\&\?]*).*/;
    const match = url.match(regExp);
    return (match && match[2].length === 11) ? match[2] : null;
  };

  const videoId = getYouTubeVideoId(lesson?.video_url || '');

  const handleTimeUpdate = (event: { target: any }) => {
    setPlayer(event.target);
    setCurrentTime(event.target.getCurrentTime());
    setDuration(event.target.getDuration());
  };

  const formatTime = (time: number) => {
    const minutes = Math.floor(time / 60);
    const seconds = Math.floor(time % 60);
    return `${minutes}:${seconds < 10 ? '0' : ''}${seconds}`;
  };

  const handleLessonChange = (value: string) => {
    const selectedLesson = allLessons.find(lesson => lesson.id === value);
    if (selectedLesson) {
      // navigate(`/course/${courseId}/session/${selectedLesson.session_id}/lesson/${value}`);
      navigate(`/course/${courseId}/lesson/${value}`);
    }
  };

  const currentLessonIndex = allLessons.findIndex(l => l.id === lessonId);
  const previousLesson = allLessons[currentLessonIndex - 1];
  const nextLesson = allLessons[currentLessonIndex + 1];

  const handlePreviousLesson = () => {
    if (previousLesson) {
      // navigate(`/course/${courseId}/session/${previousLesson.session_id}/lesson/${previousLesson.id}`);
      navigate(`/course/${courseId}/lesson/${previousLesson.id}`);
      window.scrollTo(0, 0);
    }
  };

  const handleNextLesson = () => {
    if (nextLesson) {
      // navigate(`/course/${courseId}/session/${nextLesson.session_id}/lesson/${nextLesson.id}`);
      navigate(`/course/${courseId}/lesson/${nextLesson.id}`);
      window.scrollTo(0, 0);
    }
  };

  const toggleMenu = () => {
    setMenuCollapsed(!menuCollapsed);
  };

  const renderLessonMenu = () => {
    const menuItems = allSessions.map((session) => ({
      key: `session-${session.id}`,
      icon: <MenuOutlined />,
      label: session.name,
      children: allLessons
        .filter((lesson) => lesson.session_id === session.id)
        .map((lesson) => ({
          key: `lesson-${lesson.id}`,
          label: lesson.name,
          onClick: () => handleLessonChange(lesson.id),
        })),
    }));

    return (
      <Menu
        mode="inline"
        defaultSelectedKeys={[`lesson-${lessonId}`]}
        openKeys={openKeys}
        onOpenChange={(keys) => setOpenKeys(keys as string[])}
        inlineCollapsed={menuCollapsed}
        items={menuItems}
      />
    );
  };

  const handleOk = () => {
    setIsModalVisible(false);
  };

  const handleCancel = () => {
    setIsModalVisible(false);
  };

  const breadcrumbItems = [
    { title: <Link to="/">Home</Link> },
    { title: <Link to={`/course/${courseId}`}>{course?.name}</Link> },
    { title: <Link to={`/course/${courseId}/session/${sessionId}`}>{session?.name}</Link> },
    { title: lesson?.name },
  ];

  const toggleSidebar = () => {
    setSidebarVisible(!sidebarVisible);
  };

  return (
    <div className="bg-gray-100 min-h-screen py-12">
      <div className="container mx-auto px-4">
        <div className="flex items-center mb-6">
          <Button
            icon={menuCollapsed ? <MenuOutlined /> : <CloseOutlined />}
            onClick={toggleMenu}
            type="text"
            className="text-gray-600 mr-4"
          />
          <Breadcrumb items={breadcrumbItems} className="flex-grow" />
         
        </div>

        <Row gutter={[32, 32]}>
          <Col xs={24} lg={menuCollapsed ? 2 : 6}>
            <Card className="shadow-lg rounded-lg overflow-hidden mb-8">
              <div className="flex justify-between items-center mb-4">
                <Title level={4} className={menuCollapsed ? "hidden" : "mb-0"}>Course Content</Title>
              </div>
              {renderLessonMenu()}
            </Card>
          </Col>
          <Col xs={24} lg={menuCollapsed ? 22 : 18}>
            <Card className="shadow-lg rounded-lg overflow-hidden mb-8">
              <div className="p-6">
                <Tag color="blue" className="mb-4 bg-[#1a237e] text-white">{session?.name}</Tag>
                <Title level={2} className="mb-4">{lesson?.name}</Title>
                <div className="relative aspect-video mb-6 rounded-lg overflow-hidden shadow-2xl">
                  {videoId && (
                    <YouTube
                      videoId={videoId}
                      opts={{
                        width: '100%',
                        height: '100%',
                        playerVars: {
                          autoplay: 0,
                          modestbranding: 1,
                          rel: 0,
                          showinfo: 0,
                          controls: 1,
                          origin: window.location.origin
                        },
                      }}
                      onReady={handleTimeUpdate}
                      onStateChange={handleTimeUpdate}
                      className="w-full h-full object-cover"
                    />
                  )}
                  <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black to-transparent text-white p-4">
                    <div onClick={(e) => {
                      const progressBar = e.currentTarget.querySelector('.ant-progress-bg') as HTMLElement;
                      const rect = progressBar.getBoundingClientRect();
                      const clickPosition = e.clientX - rect.left;
                      const percentClicked = (clickPosition / rect.width) * 100;
                      const newTime = (percentClicked / 100) * duration;
                      if (player) {
                        player.seekTo(newTime);
                      }
                    }}>
                      <Progress 
                        percent={(currentTime / duration) * 100} 
                        showInfo={false} 
                        strokeColor="#8529ff"
                        trailColor="rgba(255,255,255,0.3)"
                        size={4}
                        style={{ cursor: 'pointer' }}
                      />
                    </div>
                    <div className="flex justify-between text-sm mt-2">
                      <span className="font-semibold">{formatTime(currentTime)}</span>
                      <span className="font-semibold">{formatTime(duration)}</span>
                    </div>
                  </div>
                </div>
                <Paragraph className="text-gray-600 mb-6">{lesson?.description}</Paragraph>
                <div className="flex items-center mb-6">
                  <img src={instructor?.avatar_url || ''} className="mr-4 w-16 h-16 rounded-full shadow-lg" alt={instructor?.name || ''} />
                  <div className="flex-1">
                    <Text strong className="text-gray-800 text-lg">{instructor?.name}</Text>
                    <Text className="block text-gray-500 text-sm">{instructor?.description}</Text>
                  </div>
                  <Button
                    type="primary"
                    onClick={toggleSidebar}
                    className="ml-4"
                    icon={sidebarVisible ? <MenuFoldOutlined /> : <MenuUnfoldOutlined />}
                  >
                    {sidebarVisible ? 'Hide Sidebar' : 'Show Sidebar'}
                  </Button>
                </div>
                
              </div>
            </Card>
            <Row gutter={[32, 32]}>
              <Col xs={24} lg={sidebarVisible ? 16 : 24}>
                <Card className="shadow-lg rounded-lg">
                  <Title level={4} className="mb-4">Lesson Content</Title>
                  <Row gutter={[16, 16]}>
                    <Col xs={12} sm={8}>
                      <Card className="text-center hover:shadow-lg transition-shadow duration-300">
                        <PlayCircleOutlined className="text-4xl text-blue-500 mb-2" />
                        <Text className="block text-gray-500">Video Length</Text>
                        <Text strong className="text-lg">{lesson?.full_time} min</Text>
                      </Card>
                    </Col>
                    <Col xs={12} sm={8}>
                      <Card className="text-center hover:shadow-lg transition-shadow duration-300">
                        <ClockCircleOutlined className="text-4xl text-blue-500 mb-2" />
                        <Text className="block text-gray-500">Estimated Time</Text>
                        <Text strong className="text-lg">{lesson?.full_time} min</Text>
                      </Card>
                    </Col>
                    <Col xs={12} sm={8}>
                      <Card className="text-center hover:shadow-lg transition-shadow duration-300">
                        <FileTextOutlined className="text-4xl text-blue-500 mb-2" />
                        <Text className="block text-gray-500">Lesson Type</Text>
                        <Text strong className="text-lg">{lesson?.lesson_type}</Text>
                      </Card>
                    </Col>
                  </Row>
                </Card>
              </Col>
              {sidebarVisible && (
                <Col xs={24} lg={8}>
                  <LessonSidebar
                    course={course}
                    session={session}
                    lesson={lesson}
                    onContinueLesson={() => setIsModalVisible(true)}
                    onPreviousLesson={handlePreviousLesson}
                    onNextLesson={handleNextLesson}
                    previousLesson={!!previousLesson}
                    nextLesson={!!nextLesson}
                  />
                </Col>
              )}
            </Row>
          </Col>
        </Row>
      </div>
      <Modal
        title="Lesson Video"
        open={isModalVisible}
        onOk={handleOk}
        onCancel={handleCancel}
        width={800}
        footer={null}
      >
        {videoId && (
          <YouTube
            videoId={videoId}
            opts={{
              width: '100%',
              height: '450',
              playerVars: {
                autoplay: 1,
                modestbranding: 1,
                rel: 0,
                origin: window.location.origin
              },
            }}
          />
        )}
      </Modal>
    </div>
  );
};

export default LessonDetails;