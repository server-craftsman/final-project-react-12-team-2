import { lazy, Suspense, useState } from "react";
import { Tabs } from "antd";

const SearchPayment = lazy(
  () => import("../../../components/admin/payout/SearchPayment"),
);
const AmountPayment = lazy(
  () => import("../../../components/admin/payout/AmountPayment"),
);
const ViewPayment = lazy(
  () => import("../../../components/admin/payout/ViewPayment"),
);

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
      ),
    },
    {
      key: "2",
      label: "Completed",
      children: (
        <Suspense fallback={<div>Loading...</div>}>
          <ViewPayment searchQuery={searchQuery} status="COMPLETED" />
        </Suspense>
      ),
    },
    {
      key: "3",
      label: "Rejected",
      children: (
        <Suspense fallback={<div>Loading...</div>}>
          <ViewPayment searchQuery={searchQuery} status="REJECTED" />
        </Suspense>
      ),
    },
  ];

  return (
    <div className="w-full flex-col gap-4">
      <Suspense fallback={<div>Loading Search...</div>}>
        <SearchPayment onSearch={handleSearch} />
      </Suspense>
      <Suspense fallback={<div>Loading Amount...</div>}>
        <AmountPayment />
      </Suspense>
      <Tabs defaultActiveKey="1" items={items} />
    </div>
  );
};

export default ManagePayment;
