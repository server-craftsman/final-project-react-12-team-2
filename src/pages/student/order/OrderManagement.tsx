import React, { useState } from "react";
import OrderWaitingPaid from "../../../components/student/order/OrderWaitingPaid";
import OrderCompleted from "../../../components/student/order/OrderCompleted";
import { Tabs } from "antd";
import CustomSearch from "../../../components/generic/search/CustomSearch";
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
      <CustomSearch
        onSearch={setSearchTerm}
        className="search-input"
        placeholder="Search by course name or instructor..."
      />
      <Tabs defaultActiveKey="1" items={items} />
    </div>
  );
};

export default OrderManagement;
