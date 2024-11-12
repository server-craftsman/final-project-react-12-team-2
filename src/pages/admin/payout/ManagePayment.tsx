import {lazy, useState } from "react";
import { Card, Tabs } from "antd";
import { Content } from "antd/es/layout/layout";
import { PayoutStatus } from "../../../app/enums";
const CustomSearch = lazy(() => import("../../../components/generic/search/CustomSearch"));
const ViewPayment = lazy(() => import("../../../components/admin/payout/ViewPayment"));

const ManagePayment: React.FC = () => {
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [activeTabKey, setActiveTabKey] = useState<string>("1");

  const handleSearch = (query: string) => {
    setSearchQuery(query);
  };

  const handleTabChange = (key: string) => {
    setActiveTabKey(key);
  };

  const items = [
    {
      key: "1",
      label: "Request_Payout",
      children: <ViewPayment searchQuery={searchQuery} status={PayoutStatus.REQUEST_PAYOUT} onStatusChange={handleTabChange} activeTabKey={activeTabKey} />
    },
    {
      key: "2",
      label: "Completed",
      children: <ViewPayment searchQuery={searchQuery} status={PayoutStatus.COMPLETED} onStatusChange={handleTabChange} activeTabKey={activeTabKey} />
    },
    {
      key: "3",
      label: "Rejected",
      children: <ViewPayment searchQuery={searchQuery} status={PayoutStatus.REJECTED} onStatusChange={handleTabChange} activeTabKey={activeTabKey} />
    }
  ];

  return (
    <Content>
      <Card>
        <CustomSearch onSearch={handleSearch} placeholder="Search Payment" className="search-input" />
        <Tabs activeKey={activeTabKey} onChange={handleTabChange} items={items} />
      </Card>
    </Content>
  );
};

export default ManagePayment;
