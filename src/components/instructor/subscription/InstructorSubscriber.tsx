import React, { useState, useEffect } from "react";
import { Card, Avatar, Row, Col, message } from "antd";
import { GetSubscriptionsResponse } from "../../../models/api/responsive/subscription/sub.responsive.model";
import { User } from "../../../models/api/responsive/users/users.model";
import { SubscriberService } from "../../../services/subscriber/subscriber.service";
import { GetSubscribersParams } from "../../../models/api/request/subscriber/subscriber.request.model";
import { UserService } from "../../../services/instructor/user.service";
import { Link } from "react-router-dom";

interface SearchSubscriberCondition {
  keyword: string;
  is_delete: boolean;
}

interface InstructorSubscriberProps {
  searchQuery: string;
}

const InstructorSubscriber: React.FC<InstructorSubscriberProps> = ({ searchQuery }) => {
  const [subscriptions, setSubscriptions] = useState<GetSubscriptionsResponse | null>(null);
  const [users, setUsers] = useState<User[]>([]);

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

  const getSearchCondition = React.useCallback((searchQuery: string): SearchSubscriberCondition => {
    return {
      keyword: searchQuery || defaultParams.searchCondition.keyword,
      is_delete: false
    };
  }, []);
  const fetchSubscriptions = React.useCallback(async () => {
    try {
      const searchCondition = getSearchCondition(searchQuery);
      const params = {
        pageInfo: defaultParams.pageInfo,
        searchCondition
      };
      const response = await SubscriberService.getSubscribers(params as GetSubscribersParams);
      setSubscriptions(response.data?.data ? response.data.data : null);
    } catch (error) {
      message.error("No subscriptions found");
    }
  }, [searchQuery, getSearchCondition]);

  const fetchUsers = React.useCallback(async () => {
    try {
      if (subscriptions?.pageData) {
        const instructorIds = subscriptions.pageData.map(sub => sub.instructor_id);
        const response = await UserService.getUserDetails(instructorIds[0] || "");
        if (response.data?.data) {
          setUsers([response.data.data]);
        }
      }
    } catch (error) {
      message.error("Failed to fetch users");
    }
  }, [subscriptions]);

  useEffect(() => {
    fetchSubscriptions();
  }, [fetchSubscriptions]);

  useEffect(() => {
    if (subscriptions?.pageData && subscriptions.pageData.length > 0) {
      fetchUsers();
    }
  }, [subscriptions?.pageData, fetchUsers]);

  return (
    <div style={{ backgroundColor: "#f0f2f5" }}>
      <Row gutter={[12, 12]}>
        {subscriptions?.pageData.map((subscription) => {
          const user = users.find(user => user._id === subscription.instructor_id);
          return (
            <Col span={6} key={subscription._id}>
              <Link to={`/profile/${subscription.instructor_id}`} style={{ textDecoration: 'none' }}>
                <Card
                  hoverable
                  title={
                    <div style={{
                      display: "flex",
                      flexDirection: "column",
                      alignItems: "center",
                      textAlign: "center"
                    }}>
                      <Avatar src={user?.avatar_url} size={48} style={{ marginBottom: "4px" }} />
                      <span style={{ fontSize: "16px", fontWeight: "bold" }}>{user?.name}</span>
                    </div>
                  }
                  style={{
                    borderRadius: "12px",
                    border: "1px solid #000",
                    boxShadow: "0 2px 4px rgba(0, 0, 0, 0.1)",
                    backgroundColor: "#f0f2f5",
                    cursor: 'pointer',
                    textAlign: 'center'
                  }}
                  bodyStyle={{ padding: "12px" }}
                >
                  <p style={{
                    fontSize: "12px",
                    marginBottom: "4px",
                    display: 'flex',
                    justifyContent: 'center',
                    alignItems: 'center',
                    gap: '4px'
                  }}>
                    <strong>Email:</strong> {user?.email}
                  </p>
                  <p style={{
                    fontSize: "12px",
                    marginBottom: "4px",
                    display: 'flex',
                    justifyContent: 'center',
                    alignItems: 'center',
                    gap: '4px'
                  }}>
                    <strong>Phone:</strong> {user?.phone_number}
                  </p>
                </Card>
              </Link>
            </Col>
          );
        })}
      </Row>
    </div>
  );
};

export default InstructorSubscriber;
