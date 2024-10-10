import React from 'react';
import { Tabs } from 'antd';
import InstructorSubscriber from '../../../components/instructor/subscription/InstructorSubscriber';
import InstructorSubscribed from '../../../components/instructor/subscription/InstructorSubscribed';

const { TabPane } = Tabs;

const SubscriptionPage: React.FC = () => {
  return (
    <Tabs defaultActiveKey="1">
      <TabPane tab="Subscribe" key="1">
        <InstructorSubscriber />
      </TabPane>
      <TabPane tab="Subscribed" key="2">
        <InstructorSubscribed />
      </TabPane>
    </Tabs>
  );
};

export default SubscriptionPage;
