import React, { useState, useEffect, useCallback, useMemo } from "react";
import { Card, Row, Col, message, Pagination } from "antd";
// import { User } from "../../../models/api/responsive/users/users.model";
import { SubscriberService } from "../../../services/subscriber/subscriber.service";
import { GetSubscribersParams } from "../../../models/api/request/subscriber/subscriber.request.model";
// import { UserService } from "../../../services/instructor/user.service";
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
  // const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalItems, setTotalItems] = useState(0);
  const [pageSize, setPageSize] = useState(10);

  const defaultParams = useMemo(() => ({
    pageInfo: {
      pageNum: currentPage,
      pageSize: pageSize
    },
    searchCondition: {
      keyword: "",
      is_delete: false
    }
  } as const), [currentPage, pageSize]);

  const getSearchCondition = useCallback((): SearchSubscriberCondition => {
    return {
      keyword: defaultParams.searchCondition.keyword,
      is_delete: false
    };
  }, [defaultParams.searchCondition.keyword]);

  const fetchSubscriptions = useCallback(async () => {
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
      if (response.data?.data) {
        setSubscriptions(response.data.data);
        setTotalItems(response.data.data.pageInfo?.totalItems || 0);
      }
    } catch (error) {
      message.error("No subscriptions found");
    } finally {
      setLoading(false);
    }
  }, [getSearchCondition, currentPage, defaultParams.pageInfo]);

  // const fetchUsers = useCallback(async () => {
  //   if (!subscriptions?.pageData?.length) return;

  //   try {
  //     const subscriberIds = subscriptions.pageData.map((sub) => sub.subscriber_id);
  //     const uniqueIds = [...new Set(subscriberIds)]; // Remove duplicates

  //     const promises = uniqueIds.map((id) => UserService.getUserDetails(id));
  //     const responses = await Promise.all(promises);
  //     const validUsers = responses
  //       .filter((response) => response.data?.data)
  //       .map((response) => response.data.data);

  //     setUsers(validUsers);
  //   } catch (error) {
  //     message.error("Failed to fetch users");
  //   }
  // }, [subscriptions?.pageData]);

  useEffect(() => {
    const debounceTimer = setTimeout(() => {
      fetchSubscriptions();
    }, 300);

    return () => clearTimeout(debounceTimer);
  }, [fetchSubscriptions]);

  // useEffect(() => {
  //   if (subscriptions?.pageData && subscriptions.pageData.length > 0) {
  //     fetchUsers();
  //   }
  // }, [subscriptions?.pageData, fetchUsers]);

  const filteredSubscriptions = useMemo(() => {
    if (!subscriptions?.pageData) return [];
    
    const searchLower = searchValue.toLowerCase();
    return subscriptions.pageData.filter(subscription =>
      subscription.subscriber_name.toLowerCase().includes(searchLower)
    );
  }, [searchValue, subscriptions?.pageData]);

  // const filteredUsers = useMemo(() => {
  //   if (!subscriptions?.pageData) return [];

  //   const searchLower = searchValue.toLowerCase();
  //   return users.filter(user =>
  //     user.name?.toLowerCase().includes(searchLower) ||
  //     user.email?.toLowerCase().includes(searchLower) ||
  //     user.phone_number?.toLowerCase().includes(searchLower)
  //   );
  // }, [searchValue, subscriptions?.pageData, users]);

  const handlePageChange = useCallback((page: number, newPageSize?: number) => {
    setCurrentPage(page);
    if (newPageSize) setPageSize(newPageSize);
  }, []);

    return (
      <div style={{ backgroundColor: "#f0f2f5" }}>
        <Row gutter={[16, 16]}>
          {filteredSubscriptions.map((subscription) => {
           
            return (
              <Col xs={24} sm={12} md={8} lg={8} key={subscription._id}>
                <Link to={`/profile/${subscription.subscriber_id}`} style={{ textDecoration: "none" }}>
                  <Card
                    hoverable
                    loading={loading}
                    title={
                      <div style={{ display: "flex", flexDirection: "row", alignItems: "center", textAlign: "center", gap: "10px" }}>
                        <img 
                          src={`https://ui-avatars.com/api/?name=${subscription.instructor_name[0]}`} 
                          alt={subscription.instructor_name} 
                          className="w-16 h-16 rounded-full mb-4 shadow-lg border-2 border-gray-300" 
                        />
                        <span style={{ fontSize: "18px", fontWeight: "bold", color: "#333", textShadow: "1px 1px 2px rgba(0, 0, 0, 0.2)" }}>
                          {subscription.subscriber_name}
                        </span>
                      </div>
                    }
                    className="flex items-center bg-white rounded-lg shadow-md transition-transform transform hover:scale-105"
                    style={{ border: "1px solid #e0e0e0", padding: "16px" }}
                  />
                </Link>
              </Col>
            );
          })}
        </Row>
        <Row
          justify="start"
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
            showSizeChanger={true}
            showQuickJumper
            className="bg-pagination"
            style={{
              bottom: 20,
              zIndex: 1000,
            }}
          />
        </Row>
      </div>
    );
};

export default InstructorSubscriber;
