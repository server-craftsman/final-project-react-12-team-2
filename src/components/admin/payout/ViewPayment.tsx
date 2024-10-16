import { Table, Tag, message, Modal } from "antd";
import paymentsData from "../../../data/payouts.json";
import transactionsData from "../../../data/admin_transactions.json";
import { useState, useEffect } from "react";
import { Payout, PayoutStatusEnum } from "../../../models/Payout";
import { moneyFormat } from "../../../utils/helper";

interface ViewPaymentProps {
  searchQuery: string;
  status: string; // Accepting status as a prop
}

const ViewPayment: React.FC<ViewPaymentProps> = ({ searchQuery, status }) => {
  const mapStatusToEnum = (status: string): PayoutStatusEnum => {
    switch (status) {
      case "COMPLETED":
        return PayoutStatusEnum.completed;
      case "REQUEST_PAYOUT":
        return PayoutStatusEnum.request_payout;
      case "REJECTED":
        return PayoutStatusEnum.rejected;
      default:
        return PayoutStatusEnum.new;
    }
  };

  const [payments, setPayments] = useState<Payout[]>([]);
  const [selectedPayoutDetails, setSelectedPayoutDetails] = useState<unknown[]>(
    [],
  );
  const [isModalVisible, setIsModalVisible] = useState(false);

  useEffect(() => {
    const filteredPayments: Payout[] = paymentsData.payments
      .filter(
        (payment) =>
          payment.payout_no.toLowerCase().includes(searchQuery.toLowerCase()) ||
          payment.instructor_id
            .toLowerCase()
            .includes(searchQuery.toLowerCase()),
      )
      .map((payment) => ({
        ...payment,
        status: mapStatusToEnum(payment.status), // Correctly map the status
        instructor_ratio: Number(payment.instructor_ratio), // Convert instructor_ratio to number
      }))
      .filter((payment) => payment.status === mapStatusToEnum(status)); // Filter by mapped status

    setPayments(filteredPayments);
  }, [searchQuery, status]);

  const handleViewDetails = (payoutId: string) => {
    const details = transactionsData.filter(
      (detail) => detail.payout_id === payoutId,
    );
    setSelectedPayoutDetails(details);
    setIsModalVisible(true);
  };

  const handleApprove = (id: string, newStatus: PayoutStatusEnum) => {
    setPayments((prevPayments) =>
      prevPayments.map((payment) =>
        payment.id === id ? { ...payment, status: newStatus } : payment,
      ),
    );
    message.success(
      `Payment ${newStatus === PayoutStatusEnum.completed ? "completed" : "rejected"} successfully.`,
    );
  };

  const columns = [
    {
      title: "Payout No",
      dataIndex: "payout_no",
      key: "payout_no",
    },
    {
      title: "Instructor ID",
      dataIndex: "instructor_id",
      key: "instructor_id",
    },
    {
      title: "Transaction",
      key: "transaction",
      render: (_: unknown, record: Payout) => (
        <button
          onClick={() => handleViewDetails(record.id)}
          className="bg-gradient-tone rounded-md px-4 py-2 text-white"
          style={{ width: "110px", textAlign: "left" }}
        >
          View Details
        </button>
      ),
    },
    {
      title: "Balance Origin",
      dataIndex: "balance_origin",
      key: "balance_origin",
      render: (money: number) => moneyFormat(money),
    },
    {
      title: "Balance Instructor Paid",
      dataIndex: "balance_instructor_paid",
      key: "balance_instructor_paid",
      render: (money: number) => moneyFormat(money),
    },
    {
      title: "Balance Instructor Received",
      dataIndex: "balance_instructor_received",
      key: "balance_instructor_received",
      render: (money: number) => moneyFormat(money),
    },
    {
      title: "Status",
      dataIndex: "status",
      key: "status",
      render: (status: PayoutStatusEnum) => (
        <Tag
          color={
            status === PayoutStatusEnum.completed
              ? "green"
              : status === PayoutStatusEnum.request_payout
                ? "orange"
                : "volcano"
          }
        >
          {
            PayoutStatusEnum[
              status.toLowerCase() as keyof typeof PayoutStatusEnum
            ]
          }
        </Tag>
      ),
    },
    {
      title: "Date Created",
      dataIndex: "created_at",
      key: "created_at",
      render: (date: string) => new Date(date).toLocaleDateString(),
    },
    {
      title: "Action",
      key: "action",
      render: (_: unknown, record: Payout) => (
        <div
          className="flex items-center justify-between"
          style={{ minHeight: "48px" }}
        >
          {record.status === PayoutStatusEnum.request_payout && (
            <>
              <button
                onClick={() =>
                  handleApprove(record.id, PayoutStatusEnum.completed)
                }
                className="rounded-md bg-blue-500 px-4 py-2 text-white"
                style={{ width: "100px" }}
              >
                Approve
              </button>
              <button
                onClick={() =>
                  handleApprove(record.id, PayoutStatusEnum.rejected)
                }
                className="ml-1 rounded-md bg-red-500 px-4 py-2 text-white"
                style={{ width: "70px" }}
              >
                Reject
              </button>
            </>
          )}
        </div>
      ),
    },
  ];

  const detailColumns = [
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
      title: "Payout Amount",
      dataIndex: "payout_amount",
      key: "payout_amount",
      render: (money: number) => moneyFormat(money),
    },
    {
      title: "Date Created",
      dataIndex: "created_at",
      key: "created_at",
      render: (date: string) => new Date(date).toLocaleDateString(),
    },
    {
      title: "Date Updated",
      dataIndex: "updated_at",
      key: "updated_at",
      render: (date: string) => new Date(date).toLocaleDateString(),
    },
    {
      title: "Deleted",
      dataIndex: "is_deleted",
      key: "is_deleted",
      render: (isDeleted: boolean) => (isDeleted ? "Yes" : "No"),
    },
  ];

  return (
    <div className="p-0">
      <Table<Payout>
        className="shadow-lg"
        columns={columns}
        dataSource={payments}
        rowKey="id"
        pagination={{ pageSize: 10 }}
        rowClassName={() => "align-middle"}
      />

      <Modal
        title="Payout Details"
        open={isModalVisible}
        onCancel={() => setIsModalVisible(false)}
        footer={null}
        width={1000}
      >
        <Table
          columns={detailColumns}
          dataSource={selectedPayoutDetails}
          rowKey="id"
          pagination={false}
        />
      </Modal>
    </div>
  );
};

export default ViewPayment;
