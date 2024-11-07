import React, { useState } from "react";
import { Card, Avatar, Row, Col, message } from "antd";
import { GetSubscriptionsResponse } from "../../../models/api/responsive/subscription/sub.responsive.model";
import { User } from "../../../models/api/responsive/users/users.model";
import { formatDate } from "../../../utils/helper";
import { SubscriberService } from "../../../services/subscriber/subscriber.service";
import { GetSubscribersParams } from "../../../models/api/request/subscriber/subscriber.request.model";
import { useEffect } from "react";

interface SearchSubscriberCondition {
  keyword: string;
  is_delete: boolean;
}

interface InstructorSubscriberProps {
  searchQuery: string;
}

const InstructorSubscriber: React.FC<InstructorSubscriberProps> = ({ searchQuery }) => {
  const [subscriptions, setSubscriptions] = useState<GetSubscriptionsResponse | null>(null);
  const [users] = useState<User[]>([]);

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
      message.error("An unexpected error occurred while fetching subscriptions");
    }
  }, [searchQuery, getSearchCondition]);

  useEffect(() => {
    fetchSubscriptions();
  }, [fetchSubscriptions]);

  return (
    <div style={{ backgroundColor: "#f0f2f5" }}>
      <Row gutter={[12, 12]}>
        {subscriptions?.pageData.map((subscription) => {
          const user = users.find((user) => user._id === subscription.instructor_id);
          return (
            <Col span={8} key={subscription._id}>
              <Card
                title={
                  <div style={{ display: "flex", alignItems: "center" }}>
                    <Avatar src={user?.avatar_url} size={64} style={{ marginRight: "16px" }} />
                    <span style={{ fontSize: "24px", fontWeight: "bold" }}>{user?.name}</span>
                  </div>
                }
                style={{
                  borderRadius: "15px",
                  border: "2px solid #000",
                  boxShadow: "0 4px 8px rgba(0, 0, 0, 0.1)",
                  backgroundColor: "#f0f2f5"
                }}
              >
                <p style={{ fontSize: "18px", marginBottom: "8px" }}>
                  <strong>Subscription ID:</strong> {subscription._id}
                </p>
                <p style={{ fontSize: "18px", marginBottom: "8px" }}>
                  <strong>Email:</strong> {user?.email}
                </p>
                <p style={{ fontSize: "18px" }}>
                  <strong>Phone:</strong> {user?.phone_number}
                </p>
                <p style={{ fontSize: "18px", marginBottom: "8px" }}>
                  <strong>Subscription Date:</strong> {formatDate(new Date(subscription.created_at))}
                </p>
              </Card>
            </Col>
          );
        })}
      </Row>
    </div>
  );
};

export default InstructorSubscriber;
