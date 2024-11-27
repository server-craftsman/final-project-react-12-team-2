import React, { useState, useEffect, useCallback } from "react";
import { Card, Row, Col, message, Pagination, Button } from "antd";
import { GetSubscriptionsResponse } from "../../../models/api/responsive/subscription/sub.responsive.model";
import { User } from "../../../models/api/responsive/users/users.model";
import { Link, useNavigate } from "react-router-dom";
import { SubscriptionService } from "../../../services/subscription/subscription.service";
import { GetSubscriptionsParams } from "../../../models/api/request/subscription/sub.request.model";

interface SearchSubscriptionCondition {
  keyword: string;
  is_delete: boolean;
}

interface InstructorSubscribedProps {
  searchValue: string;
  fetchData: () => Promise<void>;
  refreshKey: number;
}

const InstructorSubscribed: React.FC<InstructorSubscribedProps> = ({ searchValue, refreshKey }) => {
  const navigate = useNavigate();
  const [subscriptions, setSubscriptions] = useState<GetSubscriptionsResponse | null>(null);
  const [users, setUsers] = useState<User[]>([]);
  // const [isModalOpen, setIsModalOpen] = useState(false);
  // const [isSubscribed, setIsSubscribed] = useState<boolean>(true);
  const [loading, setLoading] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalItems, setTotalItems] = useState(0);

  const defaultParams = {
    pageInfo: {
      pageNum: currentPage,
      pageSize: 10
    },
    searchCondition: {
      keyword: "",
      is_delete: false
    }
  } as const;

  const getSearchCondition = useCallback((): SearchSubscriptionCondition => {
    return {
      keyword: defaultParams.searchCondition.keyword,
      is_delete: false
    };
  }, []);

  const fetchSubscriptions = useCallback(async () => {
    setLoading(true);
    try {
      const searchCondition = getSearchCondition();
      const params: GetSubscriptionsParams = {
        pageInfo: {
          ...defaultParams.pageInfo,
          pageNum: currentPage,
        },
        searchCondition
      };
      const response = await SubscriptionService.getSubscriptions(params);
      console.log("Subscriptions response:", response);
      setSubscriptions(response.data?.data ? response.data.data : null);
      setTotalItems(response.data?.data?.pageInfo?.totalItems || 0);
    } catch (error) {
      console.error("Error fetching subscriptions:", error);
      message.error("No subscriptions found");
    } finally {
      setLoading(false);
    }
  }, [getSearchCondition, currentPage]);

  const fetchUsers = useCallback(async () => {
    // Implement the logic to fetch users here
    // This is a placeholder function
  }, []);

  // Keep this effect which handles both initial load and page changes
  useEffect(() => {
    fetchSubscriptions();
    return () => {
      setSubscriptions(null);
      setUsers([]);
    };
  }, [fetchSubscriptions, currentPage, refreshKey]);

  const filterUsers = useCallback(() => {
    if (!users || !subscriptions?.pageData) return [];

    return users.filter(user => {
      const searchLower = searchValue.toLowerCase();
      return (
        user.name?.toLowerCase().includes(searchLower) ||
        user.email?.toLowerCase().includes(searchLower) ||
        user.phone_number?.toLowerCase().includes(searchLower)
      );
    });
  }, [users, searchValue]);

  const filteredUsers = filterUsers();
  console.log("Filtered users:", filteredUsers);

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  const handleSubscribe = useCallback(async (instructorId: string) => {
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
        instructor_id: instructorId
      });
      await fetchSubscriptions();
      await fetchUsers();
      setSubscriptions(prevSubscriptions => {
        if (!prevSubscriptions) return null;
        return {
          ...prevSubscriptions,
          pageData: prevSubscriptions.pageData.map(subscription =>
            subscription.instructor_id === instructorId
              ? { ...subscription, is_subscribed: !subscription.is_subscribed }
              : subscription
          )
        };
      });
    } catch (error) {
      console.error("Error updating subscription:", error);
      message.error("Failed to update subscription.");
    } finally {
      setLoading(false);
    }
  }, [fetchSubscriptions, fetchUsers, navigate]);

  return (
    <div style={{ backgroundColor: "#f0f2f5" }}>
      <Row gutter={[16, 16]}>
        {subscriptions?.pageData?.map((subscription) => (
          <Col xs={24} sm={12} md={8} lg={8} key={subscription._id}>
            <Link to={`/profile/${subscription.instructor_id}`} style={{ textDecoration: "none" }}>
              <Card
                hoverable
                loading={loading}
                title={
                  <div style={{
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "center",
                    textAlign: "center"
                  }}>
                    <img src={`https://ui-avatars.com/api/?name=${subscription.instructor_name[0]}`} alt={subscription.instructor_name} className="w-12 h-12 rounded-full mr-4 mt-3" />
                    <span style={{ textAlign: "center", fontSize: "18px", fontWeight: "bold", color: "#333", textShadow: "1px 1px 2px rgba(0, 0, 0, 0.2)", marginTop: "10px" }}>{subscription.instructor_name}</span>
                  </div>
                }
                style={{
                  height: '100%',
                  borderRadius: "12px",
                  border: "1px solid #000",
                  boxShadow: "0 2px 4px rgba(0, 0, 0, 0.1)",
                  backgroundColor: "#f0f2f5",
                  cursor: "pointer",
                  textAlign: "center"
                }}
              >
                <div style={{ padding: "10px", display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
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
                </div>
              </Card>
            </Link>
          </Col>
        ))}
      </Row>
      <Row justify="center" style={{ marginTop: '20px' }}>
        <Pagination
          current={currentPage}
          total={totalItems}
          pageSize={defaultParams.pageInfo.pageSize}
          onChange={handlePageChange}
          showSizeChanger={false}
        />
      </Row>
    </div>
  );
};

export default InstructorSubscribed;
