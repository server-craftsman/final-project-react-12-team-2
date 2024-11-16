import { Card, Row, Col, Typography, Statistic } from "antd";
import { BookOutlined, UserOutlined, DollarOutlined, PlusOutlined } from "@ant-design/icons";
import { CourseService } from "../../../services/course/course.service";
import { SubscriberService } from "../../../services/subscriber/subscriber.service";
import { useAuth } from "../../../contexts/AuthContext";
import { useEffect, useState } from "react";
import DetailCourseModal from "./DetailCourseModal";
import DetailSubscribersModal from "./DetailSubscribersModal";
import { GetCourseResponsePageData } from "../../../models/api/responsive/course/course.response.model";
import { GetSubscribersResponse } from "../../../models/api/responsive/subscriber/subscriber.response.model";
const { Title } = Typography;
import { helpers } from "../../../utils";
import Lottie from "lottie-react";
import animationData from "../../../data/courseAnimation.json";

const Introduction = () => {
  const [totalCourses, setTotalCourses] = useState<number>(0);
  const [totalSubscribers, setTotalSubscribers] = useState<number>(0);
  const [courses, setCourses] = useState<GetCourseResponsePageData[]>();
  const [subscribers, setSubscribers] = useState<GetSubscribersResponse[]>([]);
  const [isCourseModalVisible, setCourseModalVisible] = useState<boolean>(false);
  const [isSubscriberModalVisible, setSubscriberModalVisible] = useState<boolean>(false);
  const [balance, setBalance] = useState<number>(0);
  const [totalBalance, setTotalBalance] = useState<number>(0);
  const { userInfo } = useAuth();
  const [isLoading, setIsLoading] = useState<boolean>(true);

  const fetchCourses = async () => {
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
  };

  const fetchSubscribers = async () => {
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
  };

  const fetchUserBalance = async () => {
    try {
      const balanceTotal = userInfo?.balance_total ?? 0;
      const balanceCurrent = userInfo?.balance ?? 0;
      setTotalBalance(balanceTotal);
      setBalance(balanceCurrent);
    } catch (error) {
      console.error("Failed to fetch user balance:", error);
    }
  };

  useEffect(() => {
    const fetchData = async () => {
      await fetchCourses();
      await fetchSubscribers();
      await fetchUserBalance();
      setIsLoading(false);
    };

    fetchData();
  }, []);

  if (isLoading) {
    return (
      <div className="loading">
        <Lottie animationData={animationData} />
      </div>
    );
  }

  return (
    <div className="pb-4">
      <Title level={2} className="text-gold mb-6 text-4xl font-bold">
        Dashboard
      </Title>
      <Row gutter={[16, 16]}>
        <Col xs={24} sm={12} md={6}>
          <Card onClick={() => setCourseModalVisible(true)}>
            <Statistic
              title="Total Courses"
              value={totalCourses}
              prefix={<BookOutlined className="mr-2" />}
              suffix={<PlusOutlined className="ml-2 cursor-pointer text-blue-500" />}
            />
          </Card>
        </Col>
        <Col xs={24} sm={12} md={6}>
          <Card onClick={() => setSubscriberModalVisible(true)}>
            <Statistic
              title="Total Subscribers"
              value={totalSubscribers}
              prefix={<UserOutlined className="mr-2" />}
              suffix={<PlusOutlined className="ml-2 cursor-pointer text-blue-500" />}
            />
          </Card>
        </Col>
        <Col xs={24} sm={12} md={6}>
          <Card>
            <Statistic
              title="Current Balance"
              value={helpers.moneyFormat(balance)}
              prefix={<DollarOutlined className="mr-2" />}
              suffix={<PlusOutlined className="ml-2 cursor-pointer text-blue-500" />}
            />
          </Card>
        </Col>
        <Col xs={24} sm={12} md={6}>
          <Card>
            <Statistic
              title="Total Balance"
              value={helpers.moneyFormat(totalBalance)}
              prefix={<DollarOutlined className="mr-2" />}
              suffix={<PlusOutlined className="ml-2 cursor-pointer text-blue-500" />}
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
  );
};

export default Introduction;
