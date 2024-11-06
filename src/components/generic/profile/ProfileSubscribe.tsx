import React, { useEffect, useState } from 'react'
import { Avatar, Button, Card, Typography, Row, Col, Space, message } from 'antd'
import { UserOutlined, MailOutlined, PhoneOutlined } from '@ant-design/icons'
import { SubscriptionService } from '../../../services/subscription/subscription.service'
import { Subscriptions } from '../../../models/api/responsive/subscription/update.response.model'
import { UserService } from '../../../services/admin/user.service';
import { User } from '../../../models/api/responsive/users/users.model'


const { Title, Paragraph } = Typography

const ProfileSubscribe: React.FC<{ instructorId: string }> = ({ instructorId }) => {
  const [subscription, setSubscription] = useState<Subscriptions | null>(null);
  const [userDetails, setUserDetails] = useState<User | null>(null);
  const [loading, setLoading] = useState(false);

  const fetchUserDetails = async () => {
    try {
      const response = await UserService.getUserDetails(instructorId);
      setUserDetails(response.data.data);
    } catch (error) {
      message.error('Failed to fetch user details');
    }
  };

  const fetchData = async () => {
    try {
      setLoading(true);
      const response = await SubscriptionService.createSubscribe({
        instructor_id: instructorId
      });
      setSubscription(response.data.data);
    } catch (error) {
      message.error('Failed to fetch subscription data');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
    fetchUserDetails();
  }, [instructorId]);

  const handleSubscriptionToggle = async () => {
    try {
      setLoading(true);
      if (subscription?.is_subscribed) {
        await SubscriptionService.createSubscribe({ instructor_id: instructorId });
        message.success('Unsubscribed successfully');
      } else {
        await SubscriptionService.createSubscribe({ instructor_id: instructorId });
        message.success('Subscribed successfully');
      }
      fetchData();
    } catch (error) {
      message.error(subscription?.is_subscribed ? 'Failed to unsubscribe' : 'Failed to subscribe');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ maxWidth: '1000px', margin: '0 auto', padding: '24px' }}>
      {/* Profile header section */}
      <Card>
        <Row gutter={24} align="middle">
          <Col>
            <Avatar
              size={96}
              src={userDetails?.avatar_url}
              icon={<UserOutlined />}
            />
          </Col>
          <Col flex="1">
            <Space direction="vertical" size="small">
              <Title level={3}>{userDetails?.name}</Title>
              <Space>
                <MailOutlined />
                <span>{userDetails?.email}</span>
              </Space>
              {userDetails?.phone_number && (
                <Space>
                  <PhoneOutlined />
                  <span>{userDetails?.phone_number}</span>
                </Space>
              )}
            </Space>
          </Col>
          <Col>
            <Button
              type="primary"
              onClick={handleSubscriptionToggle}
              loading={loading}
              danger={subscription?.is_subscribed}
            >
              {subscription?.is_subscribed ? 'Unsubscribe' : 'Subscribe'}
            </Button>
          </Col>
        </Row>
      </Card>

      {/* About section */}
      <Card style={{ marginTop: '24px' }}>
        <Title level={4}>About Me</Title>
        <Row gutter={[24, 24]}>
          {userDetails?.video_url && (
            <Col xs={24} md={12}>
              <div style={{ position: 'relative', paddingTop: '56.25%' }}>
                <iframe
                  style={{
                    position: 'absolute',
                    top: 0,
                    left: 0,
                    width: '100%',
                    height: '100%',
                    border: 'none',
                    borderRadius: '8px'
                  }}
                  src={userDetails.video_url}
                  title="Profile Video"
                  allowFullScreen
                />
              </div>
            </Col>
          )}
          <Col xs={24} md={userDetails?.video_url ? 12 : 24}>
            <Paragraph>
              {userDetails?.description || 'No information provided.'}
            </Paragraph>
          </Col>
        </Row>
      </Card>
    </div>
  )
}

export default ProfileSubscribe