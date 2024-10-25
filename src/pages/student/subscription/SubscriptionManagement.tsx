import React, { useState, useEffect } from "react";
import StudentSubscription from "../../../components/student/subscription/StudentSubcription";
// import SearchSubscribe from "../../../components/student/subscription/SearchSubscribe";
import CustomSearch from "../../../components/generic/search/CustomSearch";
import { Subscriptions } from "../../../models/prototype/Subscriptions";
import { UserRole } from "../../../models/prototype/User";
import subscriptionData from "../../../data/subscriptions.json";
import data from "../../../data/users.json";
import { User } from "../../../models/prototype/User";

const SubscriptionManagement: React.FC = () => {
  const [filteredSubscriptions, setFilteredSubscriptions] = useState<Subscriptions[]>([]);

  useEffect(() => {
    const instructorSubscriptions = subscriptionData.filter((subscription: Subscriptions) => {
      const user = data.users.find((user: any) => user.id === subscription.instructor_id);
      return user?.role === UserRole.instructor;
    });
    setFilteredSubscriptions(instructorSubscriptions);
  }, []);

  const handleSearch = (value: string) => {
    const lowercasedValue = value.toLowerCase();
    const filtered = subscriptionData.filter((subscription: Subscriptions) => {
      const user = data.users.find((user: any) => user.id === subscription.instructor_id);
      return user?.role === UserRole.instructor && (user?.name.toLowerCase().includes(lowercasedValue) || user?.email.toLowerCase().includes(lowercasedValue) || user?.phone_number.toLowerCase().includes(lowercasedValue) || subscription.id.toLowerCase().includes(lowercasedValue));
    });
    setFilteredSubscriptions(filtered);
  };

  const subscriptionsWithUserData = filteredSubscriptions.map((subscription) => {
    const user = data.users.find((user: any) => user.id === subscription.instructor_id);
    return {
      ...subscription,
      user: {
        name: user?.name,
        email: user?.email,
        phone_number: user?.phone_number,
        avatar_url: user?.avatar_url
      }
    };
  });

  return (
    <>
      <CustomSearch onSearch={handleSearch} className="search-input" placeholder="Search by course name or instructor..." />
      <StudentSubscription subscriptions={subscriptionsWithUserData} users={data.users as unknown as User[]} />
    </>
  );
};

export default SubscriptionManagement;
