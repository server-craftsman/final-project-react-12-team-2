import React from "react";
import { Table, Tag } from "antd";
import { Checkbox } from "antd";
import SearchPurchase from "./SearchPurchase";
import { formatDate, moneyFormat } from "../../../utils/helper";
import { PurchaseStatusEnum } from "../../../models/Purchases";

interface ViewPurchaseProps {
  filteredData: any[];
  onSearch: (value: string) => void;
  onRequest: () => void;
}

const ViewPurchase: React.FC<ViewPurchaseProps> = ({
  filteredData,
  onSearch,
  onRequest,
}) => {
  const columns = [
    {
      title: "Select",
      dataIndex: "select",
      render: () => <Checkbox />,
    },

    {
      title: "Purchase No",
      dataIndex: "purchase_no",
      key: "purchase_no",
    },
    {
      title: "Status",
      dataIndex: "status",
      key: "status",
      render: (status: string) => {
        let color = "";
        let text = "";

        switch (status) {
          case PurchaseStatusEnum.new:
            color = "blue";
            text = "new";
            break;
          case PurchaseStatusEnum.request_paid:
            color = "orange";
            text = "request_paid";
            break;
          case PurchaseStatusEnum.completed:
            color = "green";
            text = "completed";
            break;

          default:
            color = "gray";
            text = "Unknown Status";
            break;
        }

        return <Tag color={color}>{text}</Tag>;
      },
    },
    {
      title: "Price Paid",
      dataIndex: "price_paid",
      key: "price_paid",
      render: (money: number) => moneyFormat(money),
    },
    {
      title: "Price",
      dataIndex: "price",
      key: "price",
      render: (money: number) => moneyFormat(money),
    },
    {
      title: "Discount",
      dataIndex: "discount",
      key: "discount",
      render: (money: number) => moneyFormat(money),
    },

    {
      title: "Created At",
      dataIndex: "created_at",
      key: "created_at",
      render: (date: Date) => formatDate(date),
    },
    {
      title: "Updated At",
      dataIndex: "updated_at",
      key: "updated_at",
      render: (date: Date) => formatDate(date),
    },
  ];

  return (
    <div>
      <SearchPurchase onSearch={onSearch} onRequest={onRequest} />
      <Table columns={columns} dataSource={filteredData} rowKey="purchase_no" />
    </div>
  );
};

export default ViewPurchase;
