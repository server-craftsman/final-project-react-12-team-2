import React from "react";
import { Modal, Table } from "antd";
import { formatDate, moneyFormat } from "../../../utils/helper";
import { InstructorTransaction } from "../../../models/InstructorTransaction";

const ViewTransactions: React.FC<{
  isVisible: boolean;
  onClose: () => void;
  transactions: InstructorTransaction[];
}> = ({ isVisible, onClose, transactions }) => {
  const columns = [
    {
      title: "Transaction ID",
      dataIndex: "id",
      key: "id",
    },
    {
      title: "Payout ID",
      dataIndex: "payout_id",
      key: "payout_id",
    },
    {
      title: "Price",
      dataIndex: "price",
      key: "price",
      render: (amount: number | undefined) =>
        amount !== undefined ? moneyFormat(amount) : "N/A",
    },
    {
      title: "Discount",
      dataIndex: "discount",
      key: "discount",
    },
    {
      title: "Created At",
      dataIndex: "created_at",
      key: "created_at",
      render: (date: string) => (date ? formatDate(new Date(date)) : "N/A"),
    },
  ];

  return (
    <Modal
      title="Transaction Details"
      open={isVisible}
      onCancel={onClose}
      footer={null}
      width={800}
    >
      <Table
        columns={columns}
        dataSource={transactions}
        rowKey="id"
        pagination={{ pageSize: 5 }}
      />
    </Modal>
  );
};

export default ViewTransactions;
