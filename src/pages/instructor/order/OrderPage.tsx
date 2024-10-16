import { lazy, useState } from "react";
import { Tabs } from "antd";
const CustomSearch = lazy(
  () => import("../../../components/generic/search/CustomSearch"),
);
const WaitingPaid = lazy(
  () => import("../../../components/instructor/order/WaitingPaid"),
);
const Completed = lazy(
  () => import("../../../components/instructor/order/Completed"),
);

const OrderPage = () => {
  const [searchTerm, setSearchTerm] = useState("");

  const items = [
    {
      label: "Waiting Paid",
      key: "1",
      children: <WaitingPaid searchTerm={searchTerm} />,
    },
    {
      label: "Completed",
      key: "2",
      children: <Completed searchTerm={searchTerm} />,
    },
  ];

  return (
    <div>
      <CustomSearch onSearch={setSearchTerm} placeholder="Search Orders" className="search-input" />
      <Tabs defaultActiveKey="1" items={items} />
    </div>
  );
};

export default OrderPage;
