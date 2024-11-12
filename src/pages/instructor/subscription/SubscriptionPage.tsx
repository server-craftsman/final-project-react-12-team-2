import React, { useState, useEffect } from "react";
import { Tabs } from "antd";
import InstructorSubscriber from "../../../components/instructor/subscription/InstructorSubscriber";
import InstructorSubscribed from "../../../components/instructor/subscription/InstructorSubscribed";
import CustomSearch from "../../../components/generic/search/CustomSearch";
import { message } from "antd";

const SubscriptionPage: React.FC = () => {
  const [activeTab, setActiveTab] = useState("1");
  const [subscribedSearchValue, setSubscribedSearchValue] = useState("");
  const [subscriberSearchValue, setSubscriberSearchValue] = useState("");

  const handleSearch = (value: string) => {
    if (activeTab === "1") {
      setSubscribedSearchValue(value);
    } else {
      setSubscriberSearchValue(value);
    }
  };

  const handleTabChange = (key: string) => {
    setActiveTab(key);
    // Reset search value when switching tabs
    if (key === "1") {
      setSubscriberSearchValue("");
    } else {
      setSubscribedSearchValue("");
    }
  };

  useEffect(() => {
    // Xóa các hàm fetch không cần thiết
    // const fetchSubscribedData = async () => { ... };
    // const fetchSubscriberData = async () => { ... };
  }, []);

  const fetchData = async () => {
    try {
      // Implement your data fetching logic here
      // For example:
      // const response = await api.fetchSubscribedData();
      // return response.data;
    } catch (error) {
      message.error("Failed to fetch data");
    }
  };

  const items = [
    {
      key: "1",
      label: "Subscribed",
      children: activeTab === "1" ? (
        <InstructorSubscribed
          key={`subscribed-${activeTab}`}
          searchValue={subscribedSearchValue}
          fetchData={fetchData}
        />
      ) : null
    },
    {
      key: "2",
      label: "Subscriber",
      children: activeTab === "2" ? (
        <InstructorSubscriber
          key={`subscriber-${activeTab}`}
          searchValue={subscriberSearchValue}
        />
      ) : null
    }
  ];

  return (
    <div>
      <CustomSearch
        onSearch={handleSearch}
        placeholder={activeTab === "1" ? "Search subscribed instructors..." : "Search subscribers..."}
        className="search-input"
      />
      <Tabs
        activeKey={activeTab}
        defaultActiveKey="1"
        items={items}
        onChange={handleTabChange}
      />
    </div>
  );
};

export default SubscriptionPage;
