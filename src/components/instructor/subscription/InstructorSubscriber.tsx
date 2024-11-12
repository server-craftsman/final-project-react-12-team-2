import React, { useState, useEffect, useCallback } from "react";
import { Card, Avatar, Row, Col, message, Pagination } from "antd";
import { User } from "../../../models/api/responsive/users/users.model";
import { SubscriberService } from "../../../services/subscriber/subscriber.service";
import { GetSubscribersParams } from "../../../models/api/request/subscriber/subscriber.request.model";
import { UserService } from "../../../services/instructor/user.service";
import { Link } from "react-router-dom";
import { GetSubscribersResponse } from "../../../models/api/responsive/subscriber/subscriber.response.model";

interface SearchSubscriberCondition {
  keyword: string;
  is_delete: boolean;
}

interface InstructorSubscriberProps {
  searchValue: string;
}

const InstructorSubscriber: React.FC<InstructorSubscriberProps> = ({ searchValue }) => {
  const [subscriptions, setSubscriptions] = useState<GetSubscribersResponse | null>(null);
  const [users, setUsers] = useState<User[]>([]);
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

  const getSearchCondition = React.useCallback((): SearchSubscriberCondition => {
    return {
      keyword: defaultParams.searchCondition.keyword,
      is_delete: false
    };
  }, []);

  const fetchSubscriptions = React.useCallback(async () => {
    setLoading(true);
    try {
      const searchCondition = getSearchCondition();
      const params: GetSubscribersParams = {
        pageInfo: {
          ...defaultParams.pageInfo,
          pageNum: currentPage,
        },
        searchCondition
      };
      const response = await SubscriberService.getSubscribers(params);
      setSubscriptions(response.data?.data ? response.data.data : null);
      setTotalItems(response.data?.data?.pageInfo?.totalItems || 0);
    } catch (error) {
      message.error("No subscriptions found");
    } finally {
      setLoading(false);
    }
  }, [getSearchCondition, currentPage]);

  const fetchUsers = React.useCallback(async () => {
    try {
      if (subscriptions?.pageData) {
        const subscriberIds = subscriptions.pageData.map((sub) => sub.subscriber_id);
        const promises = subscriberIds.map((id) => UserService.getUserDetails(id));
        const responses = await Promise.all(promises);
        const validUsers = responses.filter((response) => response.data?.data).map((response) => response.data.data);
        setUsers(validUsers);
      }
    } catch (error) {
      message.error("Failed to fetch users");
    }
  }, [subscriptions]);

  useEffect(() => {
    fetchSubscriptions();
  }, [fetchSubscriptions, currentPage]);

  useEffect(() => {
    if (subscriptions?.pageData && subscriptions.pageData.length > 0) {
      fetchUsers();
    }
  }, [subscriptions?.pageData, fetchUsers]);

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
          const user = filteredUsers.find((user) => user._id === subscription.subscriber_id);
          if (!user) return null;
          return (
            <Col xs={24} sm={12} md={8} lg={6} key={subscription._id}>
              <Link to={`/profile/${subscription.subscriber_id}`} style={{ textDecoration: "none" }}>
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
                      <Avatar src={user?.avatar_url} size={64} style={{ marginBottom: "8px" }} />
                      <span style={{ fontSize: "16px", fontWeight: "bold" }}>{user?.name}</span>
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
                  <div>
                    <p style={{
                      fontSize: "14px",
                      marginBottom: "8px",
                      display: "flex",
                      justifyContent: "center",
                      alignItems: "center",
                      gap: "4px"
                    }}>
                      <strong>Email:</strong> {user?.email}
                    </p>
                    <p style={{
                      fontSize: "14px",
                      marginBottom: "16px",
                      display: "flex",
                      justifyContent: "center",
                      alignItems: "center",
                      gap: "4px"
                    }}>
                      <strong>Phone:</strong> {user?.phone_number}
                    </p>
                  </div>
                </Card>
              </Link>
            </Col>
          );
        })}
      </Row>
      <Row
        justify="center"
        style={{
          marginTop: '20px',
          marginBottom: '20px',
          position: 'sticky',
          bottom: 20,
          zIndex: 1000
        }}
      >
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

export default InstructorSubscriber;
