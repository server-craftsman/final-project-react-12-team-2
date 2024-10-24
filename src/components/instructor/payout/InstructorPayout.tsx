import React, { useState } from "react";
import { Button, Table, Tag } from "antd";
import payoutData from "../../../data/payouts.json";
import { formatDate, moneyFormat } from "../../../utils/helper";
const ViewTransactions = React.lazy(() => import("./ViewTransactions"));
import { Payout, PayoutStatusEnum } from "../../../models/prototype/Payout";
import { InstructorTransaction } from "../../../models/prototype/InstructorTransaction";
import instructorTransactions from "../../../data/instructor_transactions.json";
import PayoutCheckbox from "./PayoutCheckbox"; // Import PayoutCheckbox

const InstructorPayout: React.FC<{
  searchQuery: string;
  filterStatus: string;
  updateSelectedPayouts: (selected: Set<string>) => void; // Add this prop
}> = ({ searchQuery, filterStatus, updateSelectedPayouts }) => {
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [selectedTransactions, setSelectedTransactions] = useState<
    InstructorTransaction[]
  >([]);
  const [selectedPayouts, setSelectedPayouts] = useState<Set<string>>(new Set()); // Ensure setSelectedPayouts is defined
  const showModal = (payoutId: string) => {
    const transactions = instructorTransactions.transactions.filter(
      (transaction) => transaction.payout_id === payoutId,
    );
    setSelectedTransactions(transactions);
    setIsModalVisible(true);
  };

  const handleCheckboxChange = (payoutId: string, checked: boolean) => {
    const newSelectedPayouts = new Set(selectedPayouts);
    if (checked) {
      newSelectedPayouts.add(payoutId);
    } else {
      newSelectedPayouts.delete(payoutId);
    }
    setSelectedPayouts(newSelectedPayouts); // Update local state
    updateSelectedPayouts(newSelectedPayouts); // Update the parent component
  };

  const handleSelectAllChange = (checked: boolean) => {
    if (checked) {
      const allPayoutIds = filteredPayouts.map((payout) => payout.id);
      setSelectedPayouts(new Set(allPayoutIds));
      updateSelectedPayouts(new Set(allPayoutIds)); // Update the parent component
    } else {
      setSelectedPayouts(new Set());
      updateSelectedPayouts(new Set()); // Update the parent component
    }
  };

  const filteredPayouts = payoutData.payments.filter((payout) => {
    const matchesSearchQuery = payout.payout_no.includes(searchQuery);
    const matchesStatus = filterStatus === "" || payout.status === filterStatus;
    return matchesSearchQuery && matchesStatus;
  });

  const columns = [
    {
      title: (
        <PayoutCheckbox
          checked={selectedPayouts.size === filteredPayouts.length}
          onChange={handleSelectAllChange}
        />
      ),
      dataIndex: "id",
      key: "select",
      render: (id: string) => (
        <PayoutCheckbox
          checked={selectedPayouts.has(id)}
          onChange={(checked) => handleCheckboxChange(id, checked)}
        />
      ),
    },
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
