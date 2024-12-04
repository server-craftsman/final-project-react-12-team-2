import { useState, useEffect } from "react";
import { Table, Modal } from "antd";
import { notificationMessage } from "../../../utils/helper";
import { EyeOutlined, CheckOutlined, CloseOutlined } from "@ant-design/icons";
import { PayoutStatus } from "../../../app/enums";
import { formatDate, moneyFormat } from "../../../utils/helper";
import { payoutColorStatus } from "../../../utils/payoutStatus";
import { PayoutService } from "../../../services/payout/payout.service";
import ModalTransaction from "./ModalTransaction";
import { Payout } from "../../../models/prototype/Payout";
import { ColumnType } from "antd/es/table";
interface ViewPaymentProps {
  searchQuery: string;
  status: string;
  onStatusChange: (key: string) => void;
  activeTabKey: string;
  refreshKey: number;
}

const ViewPayment: React.FC<ViewPaymentProps> = ({ searchQuery, status, onStatusChange, activeTabKey, refreshKey }) => {
  const [payments, setPayments] = useState<any[]>([]);
  const [selectedPayoutDetails, setSelectedPayoutDetails] = useState<unknown[]>([]);
  const [isModalVisible, setIsModalVisible] = useState(false);
  // const [pageNum, setPageNum] = useState<number>(1);
  // const [pageSize, setPageSize] = useState<number>(10);
  const [pageInfo, setPageInfo] = useState<any>({});
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {

    let isMounted = true;

    const searchCondition = {
      payout_no: searchQuery || "",
      instructor_id: "",
      status: status || "",
      is_delete: false,
      is_instructor: true
    };

    PayoutService.getPayout({
      searchCondition,
      pageInfo: {
        pageNum: 1,
        pageSize: 10
      }
    })
      .then((response) => {
        if (!isMounted) return;

        const pageData = Array.isArray(response.data.data.pageData) 
          ? response.data.data.pageData 
          : [];

        const filteredPayments = pageData.map((payment: any) => ({
          ...payment,
          status: payment.status,
          instructor_ratio: Number(payment.instructor_ratio)
        }));

        setPayments(filteredPayments);
        setPageInfo(response.data.data.pageInfo);
      })
      .catch(() => {
        if (!isMounted) return;
        notificationMessage("Failed to fetch payments.", "error");
      });

    return () => {
      isMounted = false;
    };
  }, [searchQuery, status, activeTabKey, refreshKey]);

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

  const handleApprove = async (id: string, newStatus: PayoutStatus) => {
    const updateStatus = async (comment: string = "") => {
      try {
        const payout = payments.find((payment) => payment._id === id);
        
        if (!payout) {
          notificationMessage("Payout not found.", "error");
          return;
        }

        if (payout.status !== PayoutStatus.REQUEST_PAYOUT) {
          notificationMessage("Cannot update status. Current status is not 'request_paid'.", "error");
          return;
        }

        const payload = { status: newStatus, comment };
        await PayoutService.updatePayout(id, payload);
        setPayments((prevPayments) =>
          prevPayments.map((payment) =>
            payment._id === id ? { ...payment, status: newStatus } : payment
          )
        );

        notificationMessage(`Payment ${newStatus === PayoutStatus.COMPLETED ? "approved" : "rejected"} successfully.`, "success");
          
        onStatusChange(newStatus === PayoutStatus.COMPLETED ? "2" : "3");
      } catch (error) {
        console.error("Error updating payment status:", error);
        notificationMessage("Failed to update payment status.", "error");
      }
    };

    let comment: string = "";

    if (newStatus === PayoutStatus.REJECTED) {
      Modal.confirm({
        title: "Please provide a reason for rejection",
        content: (
          <textarea
            placeholder="Enter your comment here"
            onChange={(e) => comment = e.target.value || ""}
            style={{ width: '100%', minHeight: '100px' }}
          />
        ),
        onOk: () => updateStatus(comment),
        onCancel: () => {
          notificationMessage("Action canceled.", "info");
        }
      });
    } else {
      Modal.confirm({
        title: "Are you sure you want to approve this payment?",
        onOk: updateStatus,
        onCancel: () => {
          notificationMessage("Action canceled.", "info");
        }
      });
    }
  };

  const fetchPayments = (page: number, pageSize: number) => {
    setIsLoading(true);
    const searchCondition = {
      payout_no: searchQuery || "",
      instructor_id: "",
      status: status || "",
      is_delete: false,
      is_instructor: true
    };

    PayoutService.getPayout({
      searchCondition,
      pageInfo: {
        pageNum: page,
        pageSize: pageSize
      }
    })
      .then((response) => {
        const pageData = Array.isArray(response.data.data.pageData) 
          ? response.data.data.pageData 
          : [];

        const filteredPayments = pageData.map((payment: any) => ({
          ...payment,
          status: payment.status,
          instructor_ratio: Number(payment.instructor_ratio)
        }));

        setPayments(filteredPayments);
        setPageInfo(response.data.data.pageInfo);
      })
      .catch(() => {
        notificationMessage("Failed to fetch payments.", "error");
      })
      .finally(() => {
        setIsLoading(false);
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
      key: "instructor_name",
      render: (instructor_name: string) => (
        <div className="flex items-center">
          <span className="ml-2">{instructor_name}</span>
        </div>
      )
    },
    {
      title: "Transaction",
      key: "transactions",
      render: (_: unknown, record: any) => (
        <button
          onClick={() => handleViewDetails(record._id || "")}
          className="bg-gradient-tone rounded-md p-2 text-white ml-5"
          style={{ width: "40px", textAlign: "center" }}
        >
          <EyeOutlined />
        </button>
      )
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
      title: "Balance Origin",
      dataIndex: "balance_origin",
      key: "balance_origin",
      render: (money: number) => <div className="flex justify-end font-semibold text-emerald-600">{moneyFormat(money)}</div>
    },
    {
      title: "Balance Instructor Paid",
      dataIndex: "balance_instructor_paid",
      key: "balance_instructor_paid",
      render: (money: number) => <div className="flex justify-end font-semibold text-gray-600">{moneyFormat(money)}</div>
    },
    {
      title: "Balance Instructor Received",
      dataIndex: "balance_instructor_received",
      key: "balance_instructor_received",
      render: (money: number) => <div className="flex justify-end font-semibold text-indigo-600">{moneyFormat(money)}</div>
    },
    {
      title: "Date Created",
      dataIndex: "created_at",
      key: "created_at",
      render: (date: string) => <span className="font-bold">{formatDate(new Date(date))}</span>
    },
    {
      title: "Change Status",
      key: "action",
      render: (_: unknown, record: any) => (
        <div className="flex items-center gap-2" style={{ minHeight: "48px" }}>
          {record.status === PayoutStatus.REQUEST_PAYOUT && (
            <>
              <button
                onClick={() => handleApprove(record._id || "", PayoutStatus.COMPLETED)}
                className="bg-green-500 hover:bg-green-600 text-white px-3 py-1 rounded-md flex items-center transition duration-300 ease-in-out transform hover:scale-110"
                title="Approve"
              >
                <CheckOutlined className="mr-1" />
              </button>
              <button 
                onClick={() => handleApprove(record._id || "", PayoutStatus.REJECTED)}
                className="bg-red-500 hover:bg-red-600 text-white px-3 py-1 rounded-md flex items-center transition duration-300 ease-in-out transform hover:scale-110"
                title="Reject"
              >
                <CloseOutlined className="mr-1" />
              </button>
            </>
          )}
        </div>
      ),
      shouldDisplay: status === PayoutStatus.REQUEST_PAYOUT
    }
  ];

  // Filter columns based on shouldDisplay property
  const filteredColumns = columns.filter(column => column.shouldDisplay !== false);

  return (
    <div className="p-0">
      <Table
        loading={isLoading}
        className="shadow-lg"
        columns={filteredColumns as ColumnType<Payout>[]}
        dataSource={payments}
        rowKey={(record) => record._id || `row-${record.payout_no}`}
        rowClassName={() => "align-middle"}
        pagination={{
          current: pageInfo.pageNum,
          pageSize: pageInfo.pageSize,
          total: pageInfo.totalItems,
          showTotal: (total, range) => `${range[0]}-${range[1]} of ${total} items`,
          onChange: (page, pageSize) => {
            fetchPayments(page, pageSize);
          },
          showSizeChanger: true,
          className: "bg-pagination",
          position: ["bottomLeft"]
        }}
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

