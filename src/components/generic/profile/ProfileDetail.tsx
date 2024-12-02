import { Tabs, Card, Row, Col, Typography, Rate, Button, Tag, Avatar } from 'antd';
import { PercentageOutlined, BookOutlined, VideoCameraOutlined, ClockCircleOutlined } from '@ant-design/icons';
import { useEffect, useState } from 'react';
import { Link, useParams, useNavigate } from 'react-router-dom';
import { UserService } from "../../../services/admin/user.service";
import { CourseService } from "../../../services/course/course.service";
import { GetCourseResponsePublic } from '../../../models/api/responsive/course/course.response.model';
import './ProfileDetail.css';
import { useMediaQuery } from 'react-responsive';
import LoadingAnimation from '../../../app/UI/LoadingAnimation';
import { motion } from 'framer-motion';
import { helpers } from '../../../utils';
const { Text, Title, Paragraph } = Typography;
const { Meta } = Card;

interface UserData {
    description?: string;
}

const ProfileDetail: React.FC = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const [userData, setUserData] = useState<UserData | null>(null);
    const [courses, setCourses] = useState<GetCourseResponsePublic[]>([]);

    const isTablet = useMediaQuery({ minWidth: 768, maxWidth: 1023 });
    const isMobile = useMediaQuery({ maxWidth: 767 });
  
    useEffect(() => {
        const fetchUserData = async () => {
            if (id) {
                try {
                    const response = await UserService.getUserDetails(id);
                    setUserData(response.data.data);
                } catch (error) {
                    console.error('Error fetching user details:', error);
                }
            }
        };

        const fetchCourses = async () => {
            if (id) {
                try {
                    const response = await CourseService.getPublicCourse({
                        pageInfo: {
                            pageNum: 1,
                            pageSize: 10
                        },
                        searchCondition: {
                            keyword: "",
                            category_id: "",
                            status: "APPROVED",
                            is_delete: false
                        }
                    });
                    // Lọc chỉ lấy các khóa học của instructor này
                    const instructorCourses = response.data.data.pageData.filter(
                        course => course.instructor_id === id
                    );
                    setCourses(instructorCourses);
                } catch (error) {
                    console.error('Error fetching courses:', error);
                }
            }
        };

        fetchUserData();
        fetchCourses();
    }, [id]);

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

      
//   const getResponsiveGutter = (): [number, number] => {
//     if (isMobile) return [16, 16];
//     if (isTablet) return [24, 24];
//     return [32, 32];
//   };

  const getResponsiveImageHeight = () => {
    if (isMobile) return '200px';
    if (isTablet) return '250px';
    return '300px';
  };

    const tabItems = [
        {
            key: 'courses',
            label: 'Courses',
            children: (
                <>
                    <Button type="default" shape="round" className="my-4">
                        {courses.length} Courses
                    </Button>
                    <Row gutter={[24, 24]}>
                        {courses.map((course, index) => (
                            <Col
                                xs={24}
                                sm={12}
                                lg={8}
                                key={course._id}
                                className="course-card-animation"
                                style={{
                                    animationDelay: `${index * 0.1}s`
                                }}
                            >
                                <Link to={`/course/${course._id}`}>
                                    {/* <Card
                                        hoverable
                                        className="project-card"
                                        cover={
                                            <div style={{ overflow: 'hidden' }}>
                                                <img
                                                    alt={course.name}
                                                    src={course.image_url}
                                                    style={{
                                                        height: 200,
                                                        objectFit: 'cover',
                                                        width: '100%'
                                                    }}
                                                />
                                            </div>
                                        }
                                    >
                                        <Card.Meta
                                            title={course.name}
                                            description={
                                                <div>
                                                    <div className="course-category">
                                                        {course.category_name}
                                                    </div>
                                                    <div className="rating-price-container">
                                                        <div style={{
                                                            display: 'flex',
                                                            justifyContent: 'space-between',
                                                            alignItems: 'center'
                                                        }}>
                                                            <Rate
                                                                disabled
                                                                defaultValue={course.average_rating}
                                                                style={{ fontSize: '14px' }}
                                                            />
                                                            <Text
                                                                className="course-price"
                                                                strong
                                                            >
                                                                ${course.price_paid}
                                                            </Text>
                                                        </div>
                                                    </div>
                                                </div>
                                            }
                                        />
                                    </Card> */}
                    <Card
                      hoverable
                      cover={
                        <motion.img 
                          alt={course.name} 
                          src={course.image_url} 
                          className={`w-full object-cover`}
                          style={{ height: getResponsiveImageHeight() }}
                          whileHover={{ scale: 1.05 }}
                          transition={{ duration: 0.3 }}
                        />
                      }
                      className={`group relative flex flex-col overflow-hidden rounded-lg bg-white shadow-lg`}
                      style={{
                        height: isMobile ? 'auto' : '720px', // Increased height from 600px to 650px
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
                      <div className={`flex ${isMobile ? 'h-auto' : 'h-[500px]'} flex-col`}> {/* Increased height from 450px to 500px */}
                        <motion.div
                          initial={{ opacity: 0, y: 20 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ delay: 0.2 }}
                        >
                          <Title level={isMobile ? 4 : 3} className="mb-2 line-clamp-2 text-xl font-bold text-[#1a237e] transition duration-300 hover:text-indigo-900">
                            {course.name}
                          </Title>
                          <Paragraph className="mb-4 line-clamp-2 text-gray-600" ellipsis={{ rows: 2 }}>
                            <span dangerouslySetInnerHTML={{ __html: course.description }}></span>
                          </Paragraph>
                        </motion.div>
                        <div className={`${isMobile ? 'h-auto' : 'h-[120px]'}`}> {/* Increased height from 100px to 120px */}
                          <motion.div 
                            className="mb-4 flex items-center justify-between"
                            whileHover={{ scale: 1.02 }}
                          >
                            <span className="text-2xl font-bold text-indigo-800">{helpers.moneyFormat(course.price * (1 - course.discount / 100))}</span>
                            {course.discount > 0 && <span className="text-lg text-gray-500 line-through">{helpers.moneyFormat(course.price)}</span>}
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
                          avatar={<Avatar size={isMobile ? 32 : 48} className="bg-blue-500 text-white uppercase">{course.instructor_name ? course.instructor_name[0] : "U"}</Avatar>}
                          title={<span className="line-clamp-1 text-lg font-semibold text-gray-800">{course.instructor_name}</span>}
                          description={
                            <motion.div 
                              className={`${isMobile ? 'h-auto' : 'h-36'} mb-4 items-center text-sm`}
                              initial={{ opacity: 0 }}
                              animate={{ opacity: 1 }}
                              transition={{ delay: 0.3 }}
                            >
                              <div>
                                <Tag className="bg-gradient-tone mr-2 rounded px-2 py-1 text-xs font-semibold uppercase text-white">{course.category_name}</Tag>
                              </div>
                              <div className={`mt-4 flex ${isMobile ? 'flex-col space-y-2' : 'flex-row space-x-4'} items-center`}>
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
                              <motion.div 
                                className="mt-4 flex items-center"
                                whileHover={{ scale: 1.05 }}
                                transition={{ type: "spring", stiffness: 300 }}
                              >
                                <Rate 
                                  value={course.average_rating} 
                                  disabled 
                                  className="custom-rate-stars"
                                  style={{
                                    fontSize: "18px",
                                    filter: "drop-shadow(0 0 2px rgba(250, 204, 21, 0.4))"
                                  }}
                                />
                                <span className="ml-2 bg-gradient-to-r from-yellow-400 to-yellow-600 bg-clip-text text-lg font-bold text-transparent">
                                  {course.average_rating.toFixed(1)}
                                </span>
                              </motion.div>
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
                          size={isMobile ? "middle" : "large"}
                          className="bg-gradient-tone hover:bg-gradient-tone-hover border-none"
                          onClick={() => navigate(`/course/${course._id}`, { state: { triggerHover: true } })}
                        >
                          Preview This Course
                        </Button>
                      </motion.div>
                    </Card>
                                </Link>
                            </Col>
                        ))}
                    </Row>
                </>
            ),
        },
        {
            key: 'about',
            label: 'About',
            children: (
                <Card style={{ marginTop: 24 }}>
                    <Title level={4} className='flex items-center gap-2'>About Me  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-6">
                                <path strokeLinecap="round" strokeLinejoin="round" d="m11.25 11.25.041-.02a.75.75 0 0 1 1.063.852l-.708 2.836a.75.75 0 0 0 1.063.853l.041-.021M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Zm-9-3.75h.008v.008H12V8.25Z" />
                            </svg></Title>
                    <div style={{
                        backgroundColor: 'white',
                        padding: '24px',
                        borderRadius: '8px',
                        marginTop: '16px'
                    }}>
                        <Text>
                            <span dangerouslySetInnerHTML={{ __html: userData?.description || "" }}></span>
                        </Text>
                    </div>
                </Card>
            ),
        },
    ];

    if (userData === null && courses.length === 0) {
        return <LoadingAnimation />;
    } else {
        return (
            <div className="profile-detail">
            <Tabs 
                defaultActiveKey="work" 
                items={tabItems} 
                tabBarStyle={{
                    color: '#333', // Example: change text color
                    fontSize: '16px', // Example: change font size
                    borderBottom: '2px solid #1890ff' // Example: add border
                }}
            />
            </div>
        );
    }
};

export default ProfileDetail;