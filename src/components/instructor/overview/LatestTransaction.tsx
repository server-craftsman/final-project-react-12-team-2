import React from "react";
import { Typography, Table } from "antd";
import { transactions } from "../../../data/instructor_transactions.json";

// Hàm validation và sắp xếp ngày mới nhất
const validateAndSortByLatestDate = (data: any[]) => {
  return data
    .filter((item) => {
      const date = new Date(item.created_at);
      return !isNaN(date.getTime());
    })
    .sort((a, b) => {
      const dateA = new Date(a.created_at);
      const dateB = new Date(b.created_at);
      return dateB.getTime() - dateA.getTime();
    })
    .map((item) => ({
      ...item,
      created_at_string: new Date(item.created_at).toLocaleDateString(),
    }));
};

const LatestTransactionData = validateAndSortByLatestDate(transactions);

const columns = [
  {
    title: "Payout ID",
    dataIndex: "id",
    key: "id",
    render: (text: any) => `#${text}`,
  },
  {
    title: "Created At",
    dataIndex: "created_at_string",
    key: "created_at",
    sorter: (a: any, b: any) =>
      new Date(b.created_at).getTime() - new Date(a.created_at).getTime(),
    defaultSortOrder: "descend" as const,
  },
  {
    title: "Price",
    dataIndex: "price",
    key: "price",
    render: (price: any) => `$${price.toFixed(2)}`,
  },
  {
    title: "Discount",
    dataIndex: "discount",
    key: "discount",
    render: (discount: any) => `${discount.toFixed(2)}%`,
  },
  {
    title: "Price Paid",
    dataIndex: "price_paid",
    key: "price_paid",
    render: (price_paid: any) => `$${price_paid.toFixed(2)}`,
  },
];

const LatestTransaction: React.FC = () => {
  return (
    <div className="flex-1 rounded-sm border border-gray-200 bg-white px-4 pb-4 pt-3">
      <Typography.Text strong className="text-gray-700">
        Recent Transactions
      </Typography.Text>
      <div className="mt-3">
        <Table
          columns={columns}
          dataSource={LatestTransactionData}
          rowKey="id"
          pagination={false}
        />
      </div>
    </div>
  );
};

export default LatestTransaction;
