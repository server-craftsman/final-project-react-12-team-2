import { lazy, Suspense, useState } from "react";
import { Card, Tabs } from "antd";
import { Content } from "antd/es/layout/layout";

// const SearchPayment = lazy(
//   () => import("../../../components/admin/payout/SearchPayment"),
// );

const CustomSearch = lazy(() => import("../../../components/generic/search/CustomSearch"));
// const AmountPayment = lazy(
//   () => import("../../../components/admin/payout/AmountPayment"),
// );
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
      children: (
        <Suspense fallback={<div>Loading...</div>}>
          <ViewPayment searchQuery={searchQuery} status="REQUEST_PAYOUT" />
        </Suspense>
      )
    },
    {
      key: "2",
      label: "Completed",
      children: (
        <Suspense fallback={<div>Loading...</div>}>
          <ViewPayment searchQuery={searchQuery} status="COMPLETED" />
        </Suspense>
      )
    },
    {
      key: "3",
      label: "Rejected",
      children: (
        <Suspense fallback={<div>Loading...</div>}>
          <ViewPayment searchQuery={searchQuery} status="REJECTED" />
        </Suspense>
      )
    }
  ];

  return (
    <Content>
      <Card>
        <CustomSearch onSearch={handleSearch} placeholder="Search Payment" className="search-input" />
        {/* <Suspense fallback={<div>Loading Amount...</div>}>
          <AmountPayment />
        </Suspense> */}
        <Tabs defaultActiveKey="1" items={items} />
      </Card>
    </Content>
  );
};

export default ManagePayment;
