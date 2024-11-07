import { Avatar, Card, Typography, Row, Col, Space } from "antd";
import { UserOutlined, MailOutlined, PhoneOutlined } from "@ant-design/icons";
import { useEffect, useState } from "react";
import { User } from "../../../models/api/responsive/users/users.model";
import { UserService } from "../../../services/admin/user.service";
import { useParams } from "react-router-dom";

const { Title, Paragraph } = Typography;

const ProfileSubscribe: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const [userData, setUserData] = useState<User | null>(null);
  const [, setLoading] = useState(true);

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const response = await UserService.getUserDetails(id as string);
        setUserData(response.data.data);
      } catch (error) {
        console.error("Error fetching user data:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchUserData();
  }, []);

  return (
    <div style={{ maxWidth: "1000px", margin: "0 auto", padding: "24px" }}>
      <Card>
        <Row gutter={24} align="middle">
          <Col>
            <Avatar size={96} icon={<UserOutlined />} src={userData?.avatar_url} />
          </Col>
          <Col flex="1">
            <Space direction="vertical" size="small">
              <Title level={3}>{userData?.name || "Loading..."}</Title>
              <Space>
                <MailOutlined />
                <span>{userData?.email || "Loading..."}</span>
              </Space>
              <Space>
                <PhoneOutlined />
                <span>{userData?.phone_number || "Loading..."}</span>
              </Space>
            </Space>
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
