import React from 'react';
import { Tabs } from 'antd';
import InstructorSubscriber from '../../../components/instructor/subscription/InstructorSubscriber';
import InstructorSubscribed from '../../../components/instructor/subscription/InstructorSubscribed';

const SubscriptionPage: React.FC = () => {
  const items = [
    { key: "1", label: "Subscribe", children: <InstructorSubscriber /> },
    { key: "2", label: "Subscribed", children: <InstructorSubscribed /> },
  ];
  return (
      <Tabs defaultActiveKey="1" items={items} />
  );
};

export default SubscriptionPage;
