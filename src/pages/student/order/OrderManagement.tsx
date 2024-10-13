import React, { useState } from "react";
import OrderWaitingPaid from "../../../components/student/order/OrderWaitingPaid";
import OrderCompleted from "../../../components/student/order/OrderCompleted";
import SearchOrder from "../../../components/student/order/SearchOrder";
import { Tabs } from "antd";

const OrderManagement: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const items = [
    {
      key: "1",
      label: "Waiting for payment",
      children: <OrderWaitingPaid searchTerm={searchTerm} />,
    },
    {
      key: "2",
      label: "Completed",
      children: <OrderCompleted searchTerm={searchTerm} />,
    },
  ];

  return (
    <div>
      <SearchOrder onSearch={setSearchTerm} />
      <Tabs defaultActiveKey="1" items={items} />
    </div>
  );
};

export default OrderManagement;
