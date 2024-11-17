import { Avatar, Card, Typography, Space, Button, Modal } from "antd";
import { CheckCircleOutlined } from "@ant-design/icons";
import { useEffect, useState } from "react";
import { User } from "../../../models/api/responsive/users/users.model";
import { UserService } from "../../../services/admin/user.service";
import { useParams, useNavigate } from "react-router-dom";
import ButtonSubscribe from "./CreateSubscribe";
import { SubscriptionService } from "../../../services/subscription/subscription.service";
import ProfileDetail from "./ProfileDetail";
import { BackwardFilled } from "@ant-design/icons";
import parse from "html-react-parser";
import LoadingAnimation from "../../../app/UI/LoadingAnimation";
const ProfileSubscribe: React.FC = () => {

  const { id } = useParams<{ id: string }>();
  const [userData, setUserData] = useState<User | null>(null);
  const [, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isSubscribed, setIsSubscribed] = useState<boolean>(false);
  const [subscriberCount, setSubscriberCount] = useState<number>(0);
  const navigate = useNavigate();
  const [isVideoModalOpen, setIsVideoModalOpen] = useState(false);

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
        // const subscribed = subscriptions.filter((sub: any) => sub.user_id === id).length;
        // setSubscribedCount(subscribed);

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

  if (userData === null) {
    return <LoadingAnimation />;
  } else {
    return (
      <div style={{ maxWidth: "1500px", margin: "0 auto", padding: "10px", backgroundColor: "white", borderRadius: "15px" }}>
        <Button
        type="text"
        icon={<BackwardFilled className="text-xl" />}
        onClick={() => navigate(-1)}
        className="flex items-center gap-2 rounded-xl bg-gradient-to-r from-[#1a237e] to-[#3949ab] px-6 py-3 text-lg font-semibold text-white shadow-lg transition-all duration-300 hover:scale-105 hover:transform hover:from-[#3949ab] hover:to-[#1a237e] hover:shadow-xl active:scale-95"
        style={{ backgroundColor: "#3e2723", color: "white", border: "none", boxShadow: "0 4px 8px rgba(0, 0, 0, 0.3)", marginBottom: "10px", marginLeft: "20px" }}
      >
        Back to Course Detail
      </Button>
      <Card style={{ maxWidth: "1000px", display: "flex", flexDirection: "row", alignItems: "flex-start", border: "none" }}>
        <div style={{ flex: 1, position: "relative", textAlign: "center" }}>
          <video
            src={userData?.video_url}
            style={{ width: '100%', borderRadius: '15px', objectFit: 'cover', boxShadow: '0 4px 8px rgba(0, 0, 0, 0.3)', cursor: 'pointer' }}
            onClick={() => setIsVideoModalOpen(true)}
          />
          <Avatar
            size={170}
            src={userData?.avatar_url}
            style={{ position: 'absolute', top: '100%', right: '65%', transform: 'translate(-50%, -50%)', border: '3px solid white' }}
          />
        </div>
        <Space direction="vertical" style={{ flex: 2, padding: '16px', marginTop: '100px' }}>
          <Typography.Title level={4}>
            {userData?.name || "Loading..."} <CheckCircleOutlined style={{ color: '#1890ff' }} />
          </Typography.Title>
          <Typography.Text type="secondary">{userData?.email || "Loading..."}</Typography.Text>
          <Typography.Paragraph style={{ margin: '8px 0' }}>
            {parse(userData?.description || "Loading...")}
          </Typography.Paragraph>
          <Space direction="horizontal" style={{ justifyContent: 'space-between', width: '100%' }}>
            <ButtonSubscribe isModalOpen={isModalOpen} setIsModalOpen={setIsModalOpen} instructorId={id as string} isSubscribed={isSubscribed} setIsSubscribed={setIsSubscribed} />
            <Typography.Text style={{ fontWeight: 'bold', fontSize: '18px', color: 'black' }}>
              {subscriberCount} subscribers
            </Typography.Text>
          </Space>
        </Space>
      </Card>

      <Modal
        open={isVideoModalOpen}
        onCancel={() => setIsVideoModalOpen(false)}
        footer={null}
        width={800}
      >
        <video
          src={userData?.video_url}
          style={{ width: '100%', borderRadius: '15px', objectFit: 'cover' }}
          controls
        />
      </Modal>

      <div style={{ marginTop: "24px" }}>
        <ProfileDetail />
      </div>
      </div>
    );
  }
};

export default ProfileSubscribe;
