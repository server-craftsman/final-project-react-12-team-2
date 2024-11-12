import { Avatar, Card, Typography, Row, Col, Space, Button } from "antd";
import { UserOutlined, MailOutlined, PhoneOutlined } from "@ant-design/icons";
import { useEffect, useState } from "react";
import { User } from "../../../models/api/responsive/users/users.model";
import { UserService } from "../../../services/admin/user.service";
import { useParams, useNavigate } from "react-router-dom";
import ButtonSubscribe from "./CreateSubscribe";
import { SubscriptionService } from "../../../services/subscription/subscription.service";
import ProfileDetail from "./ProfileDetail";
import { BackwardFilled } from "@ant-design/icons";


const { Title } = Typography;

const ProfileSubscribe: React.FC = () => {

  const { id } = useParams<{ id: string }>();
  const [userData, setUserData] = useState<User | null>(null);
  const [, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isSubscribed, setIsSubscribed] = useState<boolean>(false);
  const [subscriberCount, setSubscriberCount] = useState<number>(0);
  const [subscribedCount, setSubscribedCount] = useState<number>(0);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchData = async () => {
      try {
        // Fetch user data
        const userResponse = await UserService.getUserDetails(id as string);
        setUserData(userResponse.data.data);

        // Fetch subscription status and counts
        const subscriptionResponse = await SubscriptionService.getSubscriptions({
          pageInfo: {
            pageNum: 1,
            pageSize: 10
          },
          searchCondition: {
            keyword: "",
            is_delete: false
          }
        });

        const subscriptions = subscriptionResponse.data?.data.pageData || [];

        // Count subscribers (people who subscribed to this instructor)
        const subscribers = subscriptions.filter((sub: any) => sub.instructor_id === id).length;
        setSubscriberCount(subscribers);

        // Count subscribed (instructors this user has subscribed to)
        const subscribed = subscriptions.filter((sub: any) => sub.user_id === id).length;
        setSubscribedCount(subscribed);

        // Check if this instructor is in the subscriptions list
        const isCurrentInstructorSubscribed = subscriptionResponse.data?.data.pageData.some((sub: any) => sub.instructor_id === id);
        setIsSubscribed(!!isCurrentInstructorSubscribed);
      } catch (error) {
        console.error("Error fetching data:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [id]);

  return (

    <div style={{ maxWidth: "1000px", margin: "0 auto", padding: "24px" }}>
      <Button
        type="text"
        icon={<BackwardFilled className="text-xl" />}
        onClick={() => navigate(-1)}
        className="flex items-center gap-2 rounded-xl bg-gradient-to-r from-[#1a237e] to-[#3949ab] px-6 py-3 text-lg font-semibold text-white shadow-lg transition-all duration-300 hover:scale-105 hover:transform hover:from-[#3949ab] hover:to-[#1a237e] hover:shadow-xl active:scale-95"
      >
        Back to Course Detail
      </Button>
      <Card>
        <Row gutter={24} align="middle">
          <Col>
            <Avatar size={96} icon={<UserOutlined />} src={userData?.avatar_url} />
          </Col>
          <Col flex="1">
            <Space direction="vertical" size="small">
              <Title level={3} style={{ margin: 0 }}>
                {userData?.name || "Loading..."}
              </Title>
              <Space>
                <MailOutlined />
                <span>{userData?.email || "Loading..."}</span>
              </Space>
              <Space>
                <PhoneOutlined />
                <span>{userData?.phone_number || "Loading..."}</span>
              </Space>
              {userData?.role === "instructor" && (
                <ButtonSubscribe
                  isModalOpen={isModalOpen}
                  setIsModalOpen={setIsModalOpen}
                  instructorId={id as string}
                  isSubscribed={isSubscribed}
                  setIsSubscribed={setIsSubscribed}
                />
              )}
            </Space>

            <div style={{ position: 'absolute', top: 24, right: 24, textAlign: 'center' }}>
              <Row gutter={24}>
                <Col>
                  <Typography.Text strong>Subscribers</Typography.Text>
                  <div>{subscriberCount}</div>
                </Col>
                <Col>
                  <Typography.Text strong>Subscribed</Typography.Text>
                  <div>{subscribedCount}</div>
                </Col>
              </Row>
            </div>
          </Col>
        </Row>
      </Card>

      <div style={{ marginTop: "24px" }}>
        <ProfileDetail />
      </div>
    </div>
  );
};

export default ProfileSubscribe;
