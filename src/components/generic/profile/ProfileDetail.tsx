import { Tabs, Card, Row, Col, Typography, Rate } from 'antd';
import { useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import { UserService } from "../../../services/admin/user.service";
import { CourseService } from "../../../services/course/course.service";
import { GetCourseResponsePublic } from '../../../models/api/responsive/course/course.response.model';
import parse from 'html-react-parser';
import './ProfileDetail.css';

const { TabPane } = Tabs;
const { Text, Title } = Typography;

interface UserData {
    description?: string;
}

const ProfileDetail: React.FC = () => {
    const { id } = useParams();
    const [userData, setUserData] = useState<UserData | null>(null);
    const [courses, setCourses] = useState<GetCourseResponsePublic[]>([]);

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

    return (
        <div className="profile-detail">

            <Tabs defaultActiveKey="work">
                <TabPane tab="Courses" key="work">
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
                            > <Link to={`/course/${course._id}`}>
                                    <Card
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
                                    </Card>
                                </Link>
                            </Col>
                        ))}
                    </Row>
                </TabPane>
                <TabPane tab="About" key="about">
                    <Card style={{ marginTop: 24 }}>
                        <Title level={4}>About Me</Title>
                        <div style={{
                            backgroundColor: '#f5f5f5',
                            padding: '24px',
                            borderRadius: '8px',
                            marginTop: '16px'
                        }}>
                            <Text>
                                {parse(userData?.description || 'No description available')}
                            </Text>
                        </div>
                    </Card>
                </TabPane>
            </Tabs>
        </div>
    );
};

export default ProfileDetail;