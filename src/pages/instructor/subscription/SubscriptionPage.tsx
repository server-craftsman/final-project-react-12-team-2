import React, { useEffect, useState } from "react";
import { Tabs } from "antd";
import InstructorSubscriber from "../../../components/instructor/subscription/InstructorSubscriber";
import InstructorSubscribed from "../../../components/instructor/subscription/InstructorSubscribed";
import subscriptionData from "../../../data/subscriptions.json";
import CustomSearch from "../../../components/generic/search/CustomSearch";
import { UserRole } from "../../../models/prototype/User";
import data from "../../../data/users.json";
import { Subscriptions } from "../../../models/prototype/Subscriptions";
import { User } from "../../../models/prototype/User";

const SubscriptionPage: React.FC = () => {
  const [filteredSubscriptions, setFilteredSubscriptions] = useState<
    Subscriptions[]
  >([]);

  useEffect(() => {
    const instructorSubscriptions = subscriptionData.filter(
      (subscription: Subscriptions) => {
        const user = data.users.find(
          (user: any) => user.id === subscription.instructor_id,
        );
        return user?.role === UserRole.instructor;
      },
    );
    setFilteredSubscriptions(instructorSubscriptions);
  }, []);

  const handleSearch = (value: string) => {
    const lowercasedValue = value.toLowerCase();
    const filtered = subscriptionData.filter((subscription: Subscriptions) => {
      const user = data.users.find(
        (user: any) => user.id === subscription.instructor_id,
      );
      return (
        user?.role === UserRole.instructor &&
        (user?.name.toLowerCase().includes(lowercasedValue) ||
          user?.email.toLowerCase().includes(lowercasedValue) ||
          user?.phone_number.toLowerCase().includes(lowercasedValue) ||
          subscription.id.toLowerCase().includes(lowercasedValue))
      );
    });
    setFilteredSubscriptions(filtered);
  };

  const subscriptionsWithUserData = filteredSubscriptions.map(
    (subscription) => {
      const user = data.users.find(
        (user: any) => user.id === subscription.instructor_id,
      );
      return {
        ...subscription,
        user: {
          name: user?.name,
          email: user?.email,
          phone_number: user?.phone_number,
          avatar_url: user?.avatar_url,
        },
      };
    },
  );

  const items = [
    {
      key: "1",
      label: "Subscribed",
      children: (
        <InstructorSubscribed
          subscriptions={subscriptionsWithUserData}
          users={data.users as unknown as User[]}
        />
      ),
    },
    {
      key: "2",
      label: "Subscriber",
      children: (
        <InstructorSubscriber
          subscriptions={subscriptionsWithUserData}
          users={data.users as unknown as User[]}
        />
      ),
    },
  ];

  return (
    <div>
      <CustomSearch
        onSearch={handleSearch}
        placeholder="Search instructors..."
        className="search-input"
      />
      <Tabs defaultActiveKey="1" items={items} />
    </div>
  );
};

export default SubscriptionPage;
