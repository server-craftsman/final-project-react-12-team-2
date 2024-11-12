import { useState, useEffect } from "react";
import { Table, message, Modal } from "antd";
import { EyeOutlined } from "@ant-design/icons";
import { PayoutStatus } from "../../../app/enums";
import { formatDate, moneyFormat } from "../../../utils/helper";
import { payoutColorStatus } from "../../../utils/payoutStatus";
import { PayoutService } from "../../../services/payout/payout.service";
import ModalTransaction from "./ModalTransaction";

interface ViewPaymentProps {
  searchQuery: string;
  status: string;
}

const ViewPayment: React.FC<ViewPaymentProps> = ({ searchQuery, status }) => {
  const [payments, setPayments] = useState<any[]>([]);
  const [selectedPayoutDetails, setSelectedPayoutDetails] = useState<unknown[]>([]);
  const [isModalVisible, setIsModalVisible] = useState(false);

  useEffect(() => {
    const fetchPayments = async () => {
      const defaultParams = {
        searchCondition: {
          payout_no: "",
          instructor_id: "",
          status: "",
          is_delete: false,
          is_instructor: true
        },
        pageInfo: {
          pageNum: 1,
          pageSize: 10
        }
      };

      try {
        const response = await PayoutService.getPayout({
          searchCondition: {
            ...defaultParams.searchCondition,
          },
          pageInfo: defaultParams.pageInfo
        });

        const pageData = Array.isArray(response.data.data.pageData) ? response.data.data.pageData : [];
        const filteredPayments = pageData.map((payment: any) => ({
          ...payment,
          status: payment.status,
          instructor_ratio: Number(payment.instructor_ratio)
        }));
        setPayments(filteredPayments);
      } catch (error) {
        message.error("Failed to fetch payments.");
      }
    };

    fetchPayments();
  }, [searchQuery, status]);

  const handleViewDetails = (payoutId: string) => {
    const payout = payments.find((payment) => payment._id === payoutId);

    if (payout) {
      const transactions = payout.transactions || [];
      setSelectedPayoutDetails(transactions);
    } else {
      setSelectedPayoutDetails([]);
    }

    setIsModalVisible(true);
  };

  const handleApprove = (id: string, newStatus: PayoutStatus) => {
    Modal.confirm({
      title: `Are you sure you want to ${newStatus === PayoutStatus.COMPLETED ? "approve" : "reject"} this payment?`,
      onOk: () => {
        setPayments((prevPayments) => prevPayments.map((payment) => (payment._id === id ? { ...payment, status: newStatus } : payment)));
        message.success(`Payment ${newStatus === PayoutStatus.COMPLETED ? "approved" : "rejected"} successfully.`);
      },
      onCancel: () => {
        message.info("Action canceled.");
      }
    });
  };

  const columns = [
    {
      title: "Payout No",
      dataIndex: "payout_no",
      key: "payout_no"
    },
    {
      title: "Instructor Name",
      dataIndex: "instructor_name",
      key: "instructor_name"
    },
    {
      title: "Transaction",
      key: "transactions",
      render: (_: unknown, record: any) => (
        <button
          onClick={() => handleViewDetails(record._id || "")}
          className="bg-gradient-tone rounded-md p-2 text-white"
          style={{ width: "40px", textAlign: "center" }}
        >
          <EyeOutlined />
        </button>
      )
    },
    {
      title: "Balance Origin",
      dataIndex: "balance_origin",
      key: "balance_origin",
      render: (money: number) => moneyFormat(money)
    },
    {
      title: "Balance Instructor Paid",
      dataIndex: "balance_instructor_paid",
      key: "balance_instructor_paid",
      render: (money: number) => moneyFormat(money)
    },
    {
      title: "Balance Instructor Received",
      dataIndex: "balance_instructor_received",
      key: "balance_instructor_received",
      render: (money: number) => moneyFormat(money)
    },
    {
      title: "Status",
      dataIndex: "status",
      key: "status",
      render: (status: string, record: any) => {
        return payoutColorStatus(status, record.status || "") || "Unknown Status";
      }
    },
    {
      title: "Date Created",
      dataIndex: "created_at",
      key: "created_at",
      render: (date: string) => formatDate(new Date(date))
    },
    {
      title: "Action",
      key: "action",
      render: (_: unknown, record: any) => (
        <div className="flex items-center justify-between" style={{ minHeight: "48px" }}>
          {record.status === status && (
            <>
              <button onClick={() => handleApprove(record._id || "" , PayoutStatus.COMPLETED)} className="rounded-md bg-blue-500 px-4 py-2 text-white" style={{ width: "100px" }}>
                Approve
              </button>
              <button onClick={() => handleApprove(record._id || "", PayoutStatus.REJECTED)} className="ml-1 rounded-md bg-red-500 px-4 py-2 text-white" style={{ width: "70px" }}>
                Reject
              </button>
            </>
          )}
        </div>
      )
    }
  ];

  return (
    <div className="p-0">
      <Table
        className="shadow-lg"
        columns={columns}
        dataSource={payments}
        rowKey={(record) => record._id || `row-${record.payout_no}`}
        pagination={{ pageSize: 10 }}
        rowClassName={() => "align-middle"}
      />

      <ModalTransaction
        isVisible={isModalVisible}
        onClose={() => setIsModalVisible(false)}
        data={selectedPayoutDetails}
      />
    </div>
  );
};
export default ViewPayment;

