import { useState, useEffect } from "react";
import { Table, message, Modal, Pagination } from "antd";
import { EyeOutlined, CheckOutlined, CloseOutlined } from "@ant-design/icons";
import { PayoutStatus } from "../../../app/enums";
import { formatDate, moneyFormat } from "../../../utils/helper";
import { payoutColorStatus } from "../../../utils/payoutStatus";
import { PayoutService } from "../../../services/payout/payout.service";
import ModalTransaction from "./ModalTransaction";

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
  const [pageNum, setPageNum] = useState<number>(1);
  const [pageSize, setPageSize] = useState<number>(10);
  const [pageInfo, setPageInfo] = useState<any>({});
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
        pageNum,
        pageSize
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
        message.error("Failed to fetch payments.");
      });

    return () => {
      isMounted = false;
    };
  }, [searchQuery, status, activeTabKey, refreshKey, pageNum, pageSize]);

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
          message.error("Payout not found.");
          return;
        }

        if (payout.status !== PayoutStatus.REQUEST_PAYOUT) {
          message.error("Cannot update status. Current status is not 'request_paid'.");
          return;
        }

        const payload = { status: newStatus, comment };
        await PayoutService.updatePayout(id, payload);
        setPayments((prevPayments) =>
          prevPayments.map((payment) =>
            payment._id === id ? { ...payment, status: newStatus } : payment
          )
        );

        message.success(`Payment ${newStatus === PayoutStatus.COMPLETED ? "approved" : "rejected"} successfully.`);
        
        onStatusChange(newStatus === PayoutStatus.COMPLETED ? "2" : "3");
      } catch (error) {
        console.error("Error updating payment status:", error);
        message.error("Failed to update payment status.");
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
          message.info("Action canceled.");
        }
      });
    } else {
      Modal.confirm({
        title: "Are you sure you want to approve this payment?",
        onOk: updateStatus,
        onCancel: () => {
          message.info("Action canceled.");
        }
      });
    }
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
          className="bg-gradient-tone rounded-md p-2 text-white ml-5"
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
        pagination={false}
        rowClassName={() => "align-middle"}
      />
      <div className="mt-5 flex justify-start">
        <Pagination
          current={pageNum}
          pageSize={pageSize}
          total={pageInfo.totalItems}
          showTotal={(total, range) => `${range[0]}-${range[1]} of ${total} items`}
          onChange={(page, pageSize) => {
            setPageNum(page);
            setPageSize(pageSize);
          }}
          className="bg-pagination"
          showSizeChanger
        />
      </div>
      <ModalTransaction
        isVisible={isModalVisible}
        onClose={() => setIsModalVisible(false)}
        data={selectedPayoutDetails}
      />
    </div>
  );
};
export default ViewPayment;

