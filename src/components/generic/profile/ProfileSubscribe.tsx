import { Avatar, Card, Typography, Space, Button, Modal } from "antd";
import { CheckCircleOutlined } from "@ant-design/icons";
import { useEffect, useState, useCallback } from "react";
import { User } from "../../../models/api/responsive/users/users.model";
import { UserService } from "../../../services/admin/user.service";
import { useParams, useNavigate } from "react-router-dom";
import ProfileDetail from "./ProfileDetail";
import { BackwardFilled } from "@ant-design/icons";
import LoadingAnimation from "../../../app/UI/LoadingAnimation";
import { SubscriptionService } from "../../../services/subscription/subscription.service";
import { message } from "antd";

const ProfileSubscribe: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const [userData, setUserData] = useState<User | null>(null);
  const [isLoading, setLoading] = useState(true);
  const [isSubscribed, setIsSubscribed] = useState<boolean>(false);
  const navigate = useNavigate();
  const [isVideoModalOpen, setIsVideoModalOpen] = useState(false);

  // const userInfo = localStorage.getItem("userInfo");
  // const userId = userInfo ? JSON.parse(userInfo)._id : null;

  const fetchUserData = useCallback(async () => {
    try {
      const userResponse = await UserService.getUserDetails(id as string);
      setUserData(userResponse.data.data);

      const userInfo = localStorage.getItem("userInfo");
      const userId = userInfo ? JSON.parse(userInfo)._id : null;
      if (userId) {
        setIsSubscribed(true);
      }
      const isSubscribed = userResponse.data.data.is_subscribed || false;
      setIsSubscribed(isSubscribed);
    } catch (error) {
      console.error("Error fetching data:", error);
    } finally {
      setLoading(false);
    }
  }, [id]);

  useEffect(() => {
    fetchUserData();
  }, [fetchUserData]);

  const handleSubscribe = useCallback(async () => {
    const token = localStorage.getItem("token");
    const userInfo = localStorage.getItem("userInfo");

    if (!token || !userInfo) {
      navigate("/login");
      message.error("Please log in to subscribe.");
      return;
    }

    try {
      setLoading(true);
      await SubscriptionService.createSubscribe({
        instructor_id: id as string
      });
      await fetchUserData();
    } catch (error) {
      console.error("Error updating subscription:", error);
    } finally {
      setLoading(false);
    }
  }, [id, fetchUserData, navigate]);

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
            <Typography.Text type="secondary" className="flex items-center gap-2 mb-4">
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-6">
                <path strokeLinecap="round" strokeLinejoin="round" d="M21.75 6.75v10.5a2.25 2.25 0 0 1-2.25 2.25h-15a2.25 2.25 0 0 1-2.25-2.25V6.75m19.5 0A2.25 2.25 0 0 0 19.5 4.5h-15a2.25 2.25 0 0 0-2.25 2.25m19.5 0v.243a2.25 2.25 0 0 1-1.07 1.916l-7.5 4.615a2.25 2.25 0 0 1-2.36 0L3.32 8.91a2.25 2.25 0 0 1-1.07-1.916V6.75" />
              </svg>
              {userData?.email || "Loading..."}
            </Typography.Text>
            <Space direction="horizontal" style={{ justifyContent: 'space-between', width: '100%' }}>
              <Button 
                loading={isLoading} 
                onClick={handleSubscribe}
              >
                {isSubscribed ? "Unsubscribe" : "Subscribe"}
              </Button>
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
