import React, { useState, useEffect, useCallback } from "react";
import { Card, Row, Col, message, Pagination } from "antd";
import { GetSubscriptionsResponse } from "../../../models/api/responsive/subscription/sub.responsive.model";
import { User } from "../../../models/api/responsive/users/users.model";
import { Link } from "react-router-dom";
import { SubscriptionService } from "../../../services/subscription/subscription.service";
import { GetSubscriptionsParams } from "../../../models/api/request/subscription/sub.request.model";
import { UserService } from "../../../services/instructor/user.service";
import ButtonSubscribe from "../../generic/profile/CreateSubscribe";

interface SearchSubscriptionCondition {
  keyword: string;
  is_delete: boolean;
}

interface InstructorSubscribedProps {
  searchValue: string;
  fetchData: () => Promise<void>;
}

const InstructorSubscribed: React.FC<InstructorSubscribedProps> = ({ searchValue }) => {
  const [subscriptions, setSubscriptions] = useState<GetSubscriptionsResponse | null>(null);
  const [users, setUsers] = useState<User[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isSubscribed, setIsSubscribed] = useState<boolean>(true);
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
      setSubscriptions(response.data?.data ? response.data.data : null);
      setTotalItems(response.data?.data?.pageInfo?.totalItems || 0);
    } catch (error) {
      message.error("No subscriptions found");
    } finally {
      setLoading(false);
    }
  }, [getSearchCondition, currentPage]);

  const fetchUsers = useCallback(async () => {
    try {
      if (subscriptions?.pageData) {
        const instructorIds = subscriptions.pageData.map((sub) => sub.instructor_id);
        const promises = instructorIds.map((id) => UserService.getUserDetails(id));
        const responses = await Promise.all(promises);
        const validUsers = responses
          .filter((response) => response.data?.data)
          .map((response) => response.data.data);
        setUsers(validUsers);
      }
    } catch (error) {
      message.error("Failed to fetch users");
    }
  }, [subscriptions]);

  // Effect for fetching users when subscriptions change
  useEffect(() => {
    if (subscriptions?.pageData && subscriptions.pageData.length > 0) {
      fetchUsers();
    }
  }, [subscriptions?.pageData, fetchUsers]);

  // Keep this effect which handles both initial load and page changes
  useEffect(() => {
    fetchSubscriptions();
    return () => {
      setSubscriptions(null);
      setUsers([]);
    };
  }, [fetchSubscriptions, currentPage]);

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

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  return (
    <div style={{ backgroundColor: "#f0f2f5" }}>
      <Row gutter={[16, 16]}>
        {subscriptions?.pageData.map((subscription) => {
          const user = filteredUsers.find((user) => user._id === subscription.instructor_id);
          if (!user) return null;
          return (
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
                      {/* <Avatar src={user?.avatar_url} size={64} style={{ marginBottom: "8px" }} /> */}
                      <img src={`https://ui-avatars.com/api/?name=${subscription.instructor_name[0]}`} alt={subscription.instructor_name} className="w-12 h-12 rounded-full mr-4" />

                      <span style={{ fontSize: "18px", fontWeight: "bold", color: "#333", textShadow: "1px 1px 2px rgba(0, 0, 0, 0.2)" }}>{subscription.instructor_name}</span>
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
                  bodyStyle={{ padding: "12px", display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}
                >
                  {/* <div>
                    <p style={{
                      fontSize: "14px",
                      marginBottom: "8px",
                      display: "flex",
                      justifyContent: "flex-start",
                      alignItems: "center",
                      gap: "4px",
                      paddingLeft: "16px"
                    }}>
                      <strong>Email:</strong> {subscription.}
                    </p>
                    <p style={{
                      fontSize: "14px",
                      marginBottom: "16px",
                      display: "flex",
                      justifyContent: "flex-start",
                      alignItems: "center",
                      gap: "4px",
                      paddingLeft: "16px"
                    }}>
                      <strong>Phone:</strong> {user?.phone_number}
                    </p>
                  </div> */}
                  <div
                    onClick={(e) => e.preventDefault()}
                    style={{
                      display: "flex",
                      justifyContent: "center",
                      marginTop: "auto"
                    }}
                  >
                    <ButtonSubscribe isModalOpen={isModalOpen} setIsModalOpen={setIsModalOpen} instructorId={user?._id || ""} isSubscribed={isSubscribed} setIsSubscribed={setIsSubscribed} />
                  </div>
                </Card>
              </Link>
            </Col>
          );
        })}
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
