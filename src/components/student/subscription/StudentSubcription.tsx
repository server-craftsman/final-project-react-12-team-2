import React, { useState, useEffect, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { Card, Avatar, Row, Col, Button } from "antd";
import { Link } from "react-router-dom";
import { GetSubscriptionsResponse } from "../../../models/api/responsive/subscription/sub.responsive.model";
import { User } from "../../../models/api/responsive/users/users.model";
import { SubscriptionService } from "../../../services/subscription/subscription.service";
import { GetSubscriptionsParams } from "../../../models/api/request/subscription/sub.request.model";
import { UserService } from "../../../services/instructor/user.service";
import { helpers } from "../../../utils";
// import ButtonSubscribe from "../../generic/profile/CreateSubscribe";

// ... existing interface definitions ...
interface StudentSubscriptionProps {
  searchQuery: string;
  refreshKey: number;
}

const StudentSubscription: React.FC<StudentSubscriptionProps> = ({ searchQuery, refreshKey }) => {
  const navigate = useNavigate();
  const [subscriptions, setSubscriptions] = useState<GetSubscriptionsResponse | null>(null);
  const [loading, setLoading] = useState(false);
  const [users, setUsers] = useState<User[]>([]);
  // const [isModalOpen, setIsModalOpen] = useState(false);
  // const [isSubscribed, setIsSubscribed] = useState<boolean>(true);

  // ... API calling logic ...
  const defaultParams = {
    pageInfo: {
      pageNum: 1,
      pageSize: 10
    },
    searchCondition: {
      keyword: "",
      is_delete: false
    }
  } as const;

  const getSearchCondition = useCallback(
    (searchQuery: string) => ({
      keyword: searchQuery || defaultParams.searchCondition.keyword,
      is_delete: false
    }),
    []
  );

  const fetchSubscriptions = useCallback(async () => {
    try {
      const searchCondition = getSearchCondition(searchQuery);
      const params: GetSubscriptionsParams = {
        pageInfo: defaultParams.pageInfo,
        searchCondition
      };
      const response = await SubscriptionService.getSubscriptions(params);
      setSubscriptions(response.data?.data ? response.data.data : null);
    } catch (error) {
      helpers.notificationMessage("No subscriptions found", "error");
    }
  }, [searchQuery, getSearchCondition, refreshKey]);

  const fetchUsers = useCallback(async () => {
    try {
      if (subscriptions?.pageData) {
        const instructorIds = subscriptions.pageData.map((sub) => sub.instructor_id);
        const promises = instructorIds.map((id) => UserService.getUserDetails(id));
        const responses = await Promise.all(promises);
        const validUsers = responses.filter((response) => response.data?.data).map((response) => response.data.data);
        setUsers(validUsers);
      }
    } catch (error) {
      helpers.notificationMessage("Failed to fetch users", "error");
    }
  }, [subscriptions]);

  useEffect(() => {
    fetchSubscriptions();
  }, [fetchSubscriptions]);

  useEffect(() => {
    if (subscriptions?.pageData && subscriptions.pageData.length > 0) {
      fetchUsers();
    }
  }, [subscriptions?.pageData]);

  const handleSubscribe = useCallback(async (instructorId: string) => {
    const token = localStorage.getItem("token");
    const userInfo = localStorage.getItem("userInfo");

    if (!token || !userInfo) {
      navigate("/login");
      helpers.notificationMessage("Please log in to subscribe.", "error");
      return;
    }

    try {
      setLoading(true);
      await SubscriptionService.createSubscribe({
        instructor_id: instructorId
      });
      await fetchSubscriptions();
      await fetchUsers();
    } catch (error) {
      helpers.notificationMessage("Error updating subscription", "error");
    } finally {
      setLoading(false);
    }
  }, [fetchSubscriptions, fetchUsers, navigate]);

  // Updated render section
  return (
    <div style={{ backgroundColor: "#f0f2f5" }}>
      <Row gutter={[12, 12]}>
        {subscriptions?.pageData.map((subscription) => {
          const user = users.find((user) => user._id === subscription.instructor_id);
          return (
            <Col span={8} key={subscription._id}>
              <Link to={`/profile/${subscription.instructor_id}`} style={{ textDecoration: "none" }}>
                <Card
                  loading={loading}
                  hoverable
                  title={
                    <div
                      style={{
                        display: "flex",
                        flexDirection: "column",
                        alignItems: "center",
                        textAlign: "center"
                      }}
                    >
                      <Avatar src={user?.avatar_url} size={64} style={{ marginBottom: "8px", marginTop: "8px" }} />
                      <span style={{ fontSize: "20px", fontWeight: "bold" }}>{user?.name}</span>
                    </div>
                  }
                  style={{
                    borderRadius: "15px",
                    border: "2px solid #000",
                    boxShadow: "0 4px 8px rgba(0, 0, 0, 0.1)",
                    backgroundColor: "#f0f2f5",
                    cursor: "pointer",
                    textAlign: "center"
                  }}
                >
                  <p
                    style={{
                      fontSize: "14px",
                      marginBottom: "8px",
                      display: "flex",

                      gap: "4px"
                    }}
                  >
                    <strong>Email:</strong> {user?.email}
                  </p>
                  <p
                    style={{
                      fontSize: "14px",
                      marginBottom: "16px",
                      display: "flex",

                      gap: "4px"
                    }}
                  >
                    <strong>Phone:</strong> {user?.phone_number}
                  </p>
                  <div
                    onClick={(e) => e.preventDefault()}
                    style={{
                      display: "flex",
                      justifyContent: "center",
                      marginTop: "auto"
                    }}
                  >
                    <Button loading={loading} onClick={() => handleSubscribe(subscription.instructor_id)}>
                      {subscription.is_subscribed ? "Unsubscribe" : "Subscribe"}
                    </Button>
                  </div>
                </Card>
              </Link>
            </Col>
          );
        })}
      </Row>
    </div>
  );
};

export default StudentSubscription;
