import React, { useState } from "react";
import { Modal, Table } from "antd";
import { formatDate, moneyFormat } from "../../../utils/helper";

interface ViewTransactionsProps {
  isVisible: boolean;
  onClose: () => void;
  transactions: any[];
}

const ViewTransactions: React.FC<ViewTransactionsProps> = ({ isVisible, onClose, transactions }) => {
  const [pageNum, setPageNum] = useState<number>(1);
  const [pageSize, setPageSize] = useState<number>(5);

  const columns = [
    // {
    //   title: "Transaction ID",
    //   dataIndex: "_id",
    //   key: "_id"
    // },
    // {
    //   title: "Purchase ID",
    //   dataIndex: "purchase_id",
    //   key: "purchase_id"
    // },
    {
      title: "Price Original",
      dataIndex: "price",
      key: "price",
      render: (amount: number | undefined) => (
        <span className="font-semibold text-emerald-600 flex justify-end">
          {amount !== undefined ? moneyFormat(amount) : "N/A"}
        </span>
      )
    },
    {
      title: "Price Paid",
      dataIndex: "price_paid",
      key: "price_paid",
      render: (amount: number | undefined) => (
        <span className="font-semibold text-gray-600 flex justify-end">
          {amount !== undefined ? moneyFormat(amount) : "N/A"}
        </span>
      )
    },
    {
      title: "Discount",
      dataIndex: "discount",
      key: "discount",
      render: (amount: number | undefined) => (
        <span className="font-semibold text-indigo-600 flex justify-end">
          {amount !== undefined ? `${amount} % OFF` : "N/A"}
        </span>
      )
    },
    {
      title: "Created At",
      dataIndex: "created_at",
      key: "created_at",
      render: (date: string) => (
        <span className="font-bold">
          {date ? formatDate(new Date(date)) : "N/A"}
        </span>
      )
    }
  ];

  return (
    <Modal title="Transaction Details" open={isVisible} onCancel={onClose} footer={null} width={800}>
      <Table
        columns={columns}
        dataSource={transactions}
        rowKey="_id"
        pagination={{
          current: pageNum,
          pageSize: pageSize,
          total: transactions.length,
          showTotal: (total, range) => `${range[0]}-${range[1]} of ${total} items`,
          onChange: (page, pageSize) => {
            setPageNum(page);
            if (pageSize) setPageSize(pageSize);
          },
          showSizeChanger: true,
          className: "bg-pagination mr-10",
          position: ["bottomLeft"]
        }}
      />
    </Modal>
  );
};

export default ViewTransactions;
