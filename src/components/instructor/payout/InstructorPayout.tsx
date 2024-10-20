import React, { useState } from "react";
import { Button, Table, Tag } from "antd";
import payoutData from "../../../data/payouts.json";
import { formatDate, moneyFormat } from "../../../utils/helper";
const ViewTransactions = React.lazy(() => import("./ViewTransactions"));
import { Payout, PayoutStatusEnum } from "../../../models/Payout";
import { InstructorTransaction } from "../../../models/InstructorTransaction";
import instructorTransactions from "../../../data/instructor_transactions.json";

const InstructorPayout: React.FC<{
  searchQuery: string;
  filterStatus: string;
}> = ({ searchQuery, filterStatus }) => {
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [selectedTransactions, setSelectedTransactions] = useState<
    InstructorTransaction[]
  >([]);

  const showModal = (payoutId: string) => {
    const transactions = instructorTransactions.transactions.filter(
      (transaction) => transaction.payout_id === payoutId,
    );
    setSelectedTransactions(transactions);
    setIsModalVisible(true);
  };

  const columns = [
    {
      title: "Payout No",
      dataIndex: "payout_no",
      key: "payout_no",
    },
    {
      title: "Transaction",
      dataIndex: "id",
      key: "id",
      render: (_: any, record: Payout) => (
        <Button
          className="bg-gradient-tone text-white"
          onClick={() => showModal(record.id)}
        >
          View Transactions
        </Button>
      ),
    },
    {
      title: "Status",
      dataIndex: "status",
      key: "status",
      render: (status: string) => {
        let color = "";
        let text = "";

        switch (status) {
          case PayoutStatusEnum.new:
            color = "blue";
            text = "NEW";
            break;
          case PayoutStatusEnum.request_payout:
            color = "orange";
            text = "REQUEST_PAYOUT";
            break;
          case PayoutStatusEnum.completed:
            color = "green";
            text = "COMPLETED";
            break;
          case PayoutStatusEnum.rejected:
            color = "red";
            text = "REJECTED";
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
      title: "Balance Origin",
      dataIndex: "balance_origin",
      key: "balance_origin",
      render: (money: number | undefined) =>
        money !== undefined ? moneyFormat(money) : "N/A",
    },
    {
      title: "Instructor Paid",
      dataIndex: "balance_instructor_paid",
      key: "balance_instructor_paid",
      render: (money: number | undefined) =>
        money !== undefined ? moneyFormat(money) : "N/A",
    },
    {
      title: "Instructor Received",
      dataIndex: "balance_instructor_received",
      key: "balance_instructor_received",
      render: (money: number | undefined) =>
        money !== undefined ? moneyFormat(money) : "N/A",
    },
    {
      title: "Created At",
      dataIndex: "created_at",
      key: "created_at",
      render: (date: Date) => formatDate(date),
    },
  ];

  const filteredPayouts = payoutData.payments.filter((payout) => {
    const matchesSearchQuery = payout.payout_no.includes(searchQuery);
    const matchesStatus = filterStatus === "" || payout.status === filterStatus;
    return matchesSearchQuery && matchesStatus;
  });

  return (
    <div>
      <Table
        columns={columns}
        dataSource={filteredPayouts as unknown as Payout[]}
        rowKey="id"
      />
      <ViewTransactions
        isVisible={isModalVisible}
        onClose={() => setIsModalVisible(false)}
        transactions={selectedTransactions}
      />
    </div>
  );
};

export default InstructorPayout;
