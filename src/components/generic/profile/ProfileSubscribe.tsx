import { Avatar, Card, Typography, Row, Col, Space } from "antd";
import { UserOutlined, MailOutlined, PhoneOutlined } from "@ant-design/icons";
import { useEffect, useState } from "react";
import { User } from "../../../models/api/responsive/users/users.model";
import { UserService } from "../../../services/admin/user.service";
import { useParams } from "react-router-dom";
import ButtonSubscribe from "./CreateSubscribe";
import { SubscriptionService } from "../../../services/subscription/subscription.service";


const { Title, Paragraph } = Typography;

const ProfileSubscribe: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const [userData, setUserData] = useState<User | null>(null);
  const [, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isSubscribed, setIsSubscribed] = useState<boolean>(false);

  useEffect(() => {
    const fetchData = async () => {
      try {
        // Fetch user data
        const userResponse = await UserService.getUserDetails(id as string);
        setUserData(userResponse.data.data);

        // Fetch subscription status
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

        // Check if this instructor is in the subscriptions list
        const isCurrentInstructorSubscribed = subscriptionResponse.data?.data.pageData.some(
          (sub: any) => sub.instructor_id === id
        );
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
      <Card>
        <Row gutter={24} align="middle">
          <Col>
            <Avatar size={96} icon={<UserOutlined />} src={userData?.avatar_url} />
          </Col>
          <Col flex="1">
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
              <Space direction="vertical" size="small">
                <Title level={3} style={{ margin: 0 }}>{userData?.name || "Loading..."}</Title>
                <Space>
                  <MailOutlined />
                  <span>{userData?.email || "Loading..."}</span>
                </Space>
                <Space>
                  <PhoneOutlined />
                  <span>{userData?.phone_number || "Loading..."}</span>
                </Space>
              </Space>
              {userData?.role === 'instructor' && (
                <ButtonSubscribe
                  isModalOpen={isModalOpen}
                  setIsModalOpen={setIsModalOpen}
                  instructorId={id as string}
                  isSubscribed={isSubscribed}
                  setIsSubscribed={setIsSubscribed}
                />
              )}
            </div>
          </Col>
        </Row>
      </Card>
      <Card style={{ marginTop: "24px" }}>
        <Title level={4}>About Me</Title>
        <Row gutter={[24, 24]}>
          <Col xs={24}>
            <Paragraph>{userData?.description || "No description available."}</Paragraph>
          </Col>
        </Row>
      </Card>
    </div>
  );
};

export default ProfileSubscribe;
