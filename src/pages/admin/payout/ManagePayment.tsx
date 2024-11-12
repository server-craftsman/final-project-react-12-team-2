import {lazy, useState } from "react";
import { Card, Tabs } from "antd";
import { Content } from "antd/es/layout/layout";
import { PayoutStatus } from "../../../app/enums";
const CustomSearch = lazy(() => import("../../../components/generic/search/CustomSearch"));
const ViewPayment = lazy(() => import("../../../components/admin/payout/ViewPayment"));

const ManagePayment: React.FC = () => {
  const [searchQuery, setSearchQuery] = useState<string>("");

  const handleSearch = (query: string) => {
    setSearchQuery(query);
  };

  const items = [
    {
      key: "1",
      label: "Request_Payout",
      children: <ViewPayment searchQuery={searchQuery} status={PayoutStatus.REQUEST_PAYOUT} />
    },
    {
      key: "2",
      label: "Completed",
      children: <ViewPayment searchQuery={searchQuery} status={PayoutStatus.COMPLETED} />
    },
    {
      key: "3",
      label: "Rejected",
      children: <ViewPayment searchQuery={searchQuery} status={PayoutStatus.REJECTED} />
    }
  ];

  return (
    <Content>
      <Card>
        <CustomSearch onSearch={handleSearch} placeholder="Search Payment" className="search-input" />
        <Tabs defaultActiveKey="1" items={items} />
      </Card>
    </Content>
  );
};

export default ManagePayment;
