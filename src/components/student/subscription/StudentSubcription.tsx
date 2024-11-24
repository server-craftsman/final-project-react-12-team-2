import React, { useState, useEffect, useCallback } from "react";
import { Card, Avatar, Row, Col, message } from "antd";
import { Link } from "react-router-dom";
import { GetSubscriptionsResponse } from "../../../models/api/responsive/subscription/sub.responsive.model";
import { User } from "../../../models/api/responsive/users/users.model";
import { SubscriptionService } from "../../../services/subscription/subscription.service";
import { GetSubscriptionsParams } from "../../../models/api/request/subscription/sub.request.model";
import { UserService } from "../../../services/instructor/user.service";
import ButtonSubscribe from "../../generic/profile/CreateSubscribe";

// ... existing interface definitions ...
interface StudentSubscriptionProps {
  searchQuery: string;
}

const StudentSubscription: React.FC<StudentSubscriptionProps> = ({ searchQuery }) => {
  const [subscriptions, setSubscriptions] = useState<GetSubscriptionsResponse | null>(null);
  const [users, setUsers] = useState<User[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isSubscribed, setIsSubscribed] = useState<boolean>(true);

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
      message.error("No subscriptions found");
    }
  }, [searchQuery, getSearchCondition]);

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
  }, [subscriptions?.pageData]);

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
                    <ButtonSubscribe isModalOpen={isModalOpen} setIsModalOpen={setIsModalOpen} instructorId={user?._id || ""} isSubscribed={isSubscribed} setIsSubscribed={setIsSubscribed} />
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
