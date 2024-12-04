import { Card, Row, Col, Typography, Statistic, Spin } from "antd";
import { BookOutlined, UserOutlined, DollarOutlined } from "@ant-design/icons";
import { CourseService } from "../../../services/course/course.service";
import { SubscriberService } from "../../../services/subscriber/subscriber.service";
import { useAuth } from "../../../contexts/AuthContext";
import { useState, useCallback } from "react";
import DetailCourseModal from "./DetailCourseModal";
import DetailSubscribersModal from "./DetailSubscribersModal";
import { GetCourseResponsePageData } from "../../../models/api/responsive/course/course.response.model";
import { GetSubscribersResponse } from "../../../models/api/responsive/subscriber/subscriber.response.model";
const { Title } = Typography;
import { helpers } from "../../../utils";
import { useFetchDashboardInstructor } from "../../../hooks/useFetchDashboardInstructor";

interface IntroductionProps {
  isLoading: boolean;
}
const Introduction = ({ isLoading }: IntroductionProps) => {
  const [totalCourses, setTotalCourses] = useState<number>(0);
  const [totalSubscribers, setTotalSubscribers] = useState<number>(0);
  const [courses, setCourses] = useState<GetCourseResponsePageData[]>();
  const [subscribers, setSubscribers] = useState<GetSubscribersResponse[]>([]);
  const [isCourseModalVisible, setCourseModalVisible] = useState<boolean>(false);
  const [isSubscriberModalVisible, setSubscriberModalVisible] = useState<boolean>(false);
  const [balance, setBalance] = useState<number>(0);
  const [totalBalance, setTotalBalance] = useState<number>(0);
  const { userInfo } = useAuth();

  const fetchCourses = useCallback(async () => {
    let totalCoursesCount = 0;
    let pageNum = 1;
    const pageSize = 10;
    let allCourses: GetCourseResponsePageData[] = [];

    while (true) {
      const courseResponse = await CourseService.getCourse({
        searchCondition: {
          is_delete: false,
          keyword: "",
          category_id: "",
          status: ""
        },
        pageInfo: {
          pageNum,
          pageSize
        }
      });

      const pageData = courseResponse.data.data.pageData;
      allCourses = allCourses.concat(pageData);

      totalCoursesCount += pageData.length;

      if (pageData.length < pageSize) break;

      pageNum++;
    }

    setTotalCourses(totalCoursesCount);
    setCourses(allCourses);
  }, []);

  const fetchSubscribers = useCallback(async () => {
    let totalSubscribersCount = 0;
    let pageNum = 1;
    const pageSize = 10;
    let allSubscribers: Array<{ id: number; name: string }> = [];

    while (true) {
      const subscriberResponse = await SubscriberService.getSubscribers({
        searchCondition: {
          is_delete: false
        },
        pageInfo: {
          pageNum,
          pageSize
        }
      });

      const pageData = subscriberResponse.data.data.pageData;
      allSubscribers = allSubscribers.concat(
        pageData.map(subscriber => ({
          id: Number(subscriber._id),
          name: subscriber.subscriber_name,
          created_at: subscriber.created_at
        }))
      );

      totalSubscribersCount += pageData.length;

      if (pageData.length < pageSize) break;

      pageNum++;
    }

    setTotalSubscribers(totalSubscribersCount);
    setSubscribers(allSubscribers as unknown as GetSubscribersResponse[]);
  }, []);

  const fetchUserBalance = useCallback(async () => {
    try {
      const balanceTotal = userInfo?.balance_total ?? 0;
      const balanceCurrent = userInfo?.balance ?? 0;
      setTotalBalance(balanceTotal);
      setBalance(balanceCurrent);
    } catch (error) {
      console.error("Failed to fetch user balance:", error);
    }
  }, [userInfo]);

  useFetchDashboardInstructor(fetchCourses, fetchSubscribers, fetchUserBalance);

  return (
    <Spin spinning={isLoading} tip="Loading...">
      <div className="pb-4">
        <Title level={2} className="text-gold mb-6 text-4xl font-bold">
          Dashboard
        </Title>
        <Row gutter={[16, 16]}>
          <Col xs={24} sm={12} md={6}>
            <Card 
              onClick={() => setCourseModalVisible(true)} 
              className="cursor-pointer hover:underline transition-all duration-300 hover:shadow-lg hover:bg-blue-100"
            >
              <Statistic
                title="Total Courses"
                valueStyle={{ color: '#1a237e' }} // Set color to blue
                value={totalCourses}
                prefix={<BookOutlined className="mr-2" />}
              />
            </Card>
          </Col>
          <Col xs={24} sm={12} md={6}>
            <Card 
              onClick={() => setSubscriberModalVisible(true)} 
              className="cursor-pointer hover:underline transition-all duration-300 hover:shadow-lg hover:bg-blue-100"
            >
              <Statistic
                title="Total Subscribers"
                valueStyle={{ color: '#1a237e' }} // Set color to blue
                value={totalSubscribers}
                prefix={<UserOutlined className="mr-2" />}
              />
            </Card>
          </Col>
          <Col xs={24} sm={12} md={6}>
            <Card>
              <Statistic
                title="Current Balance"
                valueStyle={{ color: '#1a237e' }} // Set color to blue
                value={helpers.moneyFormat(balance)}
                prefix={<DollarOutlined className="mr-2" />}
              />
            </Card>
          </Col>
          <Col xs={24} sm={12} md={6}>
            <Card>
              <Statistic
                title="Total Balance"
                valueStyle={{ color: '#1a237e' }} // Set color to blue
                value={helpers.moneyFormat(totalBalance)}
                prefix={<DollarOutlined className="mr-2" />}
              />
            </Card>
          </Col>
        </Row>

        {courses && (
          <DetailCourseModal
            visible={isCourseModalVisible}
            onClose={() => setCourseModalVisible(false)}
            courses={courses}
          />
        )}

        <DetailSubscribersModal
          visible={isSubscriberModalVisible}
          onClose={() => setSubscriberModalVisible(false)}
          subscribers={subscribers}
        />
      </div>
    </Spin>
  );
};

export default Introduction;
