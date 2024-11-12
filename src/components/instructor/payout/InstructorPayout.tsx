import React, { useEffect, useState } from "react";
import { message, Table} from "antd";
import { EyeOutlined } from "@ant-design/icons";
import { formatDate, moneyFormat } from "../../../utils/helper";
const ViewTransactions = React.lazy(() => import("./ViewTransactions"));
import PayoutCheckbox from "./PayoutCheckbox"; // Import PayoutCheckbox
import { PayoutService } from "../../../services/payout/payout.service";
import { GetPayoutResponseModel } from "../../../models/api/responsive/payout/payout.response.model";
import { payoutColorStatus } from "../../../utils/payoutStatus";
import { PayoutStatus } from "../../../app/enums/payout.status";

interface InstructorPayoutProps {
  refreshKey: number;
  searchQuery: string;
  filterStatus: string;
  updateSelectedPayouts: (selected: Set<string>) => void;
  setSelectedPayoutId: (payoutId: string) => void;
}
const InstructorPayout: React.FC<InstructorPayoutProps> = ({ refreshKey, searchQuery, filterStatus, updateSelectedPayouts, setSelectedPayoutId }) => {
  const [payouts, setPayouts] = useState<any[]>([]);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [selectedTransactions, setSelectedTransactions] = useState<GetPayoutResponseModel[]>([]);
  const [selectedPayouts, setSelectedPayouts] = useState<Set<string>>(new Set());

    const fetchPayouts = async () => {
      try {
        const response = await PayoutService.getPayout({
          searchCondition: {
            payout_no: searchQuery,
            instructor_id: "",
            status: filterStatus,
            is_delete: false,
            is_instructor: true
          },
          pageInfo: {
            pageNum: 1,
            pageSize: 10
          }
        });

        const pageData = Array.isArray(response.data.data.pageData) ? response.data.data.pageData : [];
        const filteredPayments = pageData.map((payment: any) => ({
          ...payment,
          status: payment.status,
          instructor_ratio: Number(payment.instructor_ratio)
        }));
        setPayouts(filteredPayments);
      } catch (error) {
        message.error("Failed to fetch payouts.");
      }
    };
    useEffect(() => {
    fetchPayouts();
  }, [searchQuery, filterStatus, refreshKey]);

  const showModal = (payoutId: string) => {
    const payout = payouts.find((payment) => payment._id === payoutId);
    if (payout) {
      const transactions = payout.transactions || [];
      setSelectedTransactions(transactions);
      setIsModalVisible(true);
    } else {
      setSelectedTransactions([]);
    }
  };

  const handleCheckboxChange = (payoutId: string, checked: boolean) => {
    const newSelectedPayouts = new Set(selectedPayouts);
    if (checked) {
      newSelectedPayouts.add(payoutId);
      setSelectedPayoutId(payoutId);
    } else {
      newSelectedPayouts.delete(payoutId);
    }
    setSelectedPayouts(newSelectedPayouts);
    updateSelectedPayouts(newSelectedPayouts);
  };

  const handleSelectAllChange = (checked: boolean) => {
    if (checked) {
      const allPayoutIds = payouts.map((payout) => payout.pageData._id);
      setSelectedPayouts(new Set(allPayoutIds));
      updateSelectedPayouts(new Set(allPayoutIds));
    } else {
      setSelectedPayouts(new Set());
      updateSelectedPayouts(new Set());
    }
  };

  const columns = [
    {
      title: <PayoutCheckbox 
      checked={selectedPayouts.size === payouts.length} 
      onChange={handleSelectAllChange}
      disabled={payouts.every((payout) => payout.status === PayoutStatus.COMPLETED || payout.status === PayoutStatus.REQUEST_PAYOUT || "")}
      />,
      dataIndex: "_id",
      key: "_id",
      render: (id: string, record: any) => 
      <PayoutCheckbox checked={selectedPayouts.has(id)} 
      onChange={(checked) => handleCheckboxChange(id, checked)} 
      disabled={record.status === PayoutStatus.COMPLETED || record.status === PayoutStatus.REQUEST_PAYOUT} />
    },
    {
      title: "Payout No",
      dataIndex: "payout_no",
      key: "payout_no"
    },
    {
      title: "Transaction",
      key: "transactions",
      render: (_: any, record: any) => (
        <button 
        className="bg-gradient-tone rounded-md p-2 text-white ml-5"
        onClick={() => showModal(record._id || "")}
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
      render: (status: string) => payoutColorStatus(status, status)

    },
    {
      title: "Balance Origin",
      dataIndex: "balance_origin",
      key: "balance_origin",
      render: (money: number | undefined) => (money !== undefined ? moneyFormat(money) : "N/A")
    },
    {
      title: "Instructor Paid",
      dataIndex: "balance_instructor_paid",
      key: "balance_instructor_paid",
      render: (money: number | undefined) => (money !== undefined ? moneyFormat(money) : "N/A")
    },
    {
      title: "Instructor Received",
      dataIndex: "balance_instructor_received",
      key: "balance_instructor_received",
      render: (money: number | undefined) => (money !== undefined ? moneyFormat(money) : "N/A")
    },
    {
      title: "Created At",
      dataIndex: "created_at",
      key: "created_at",
      render: (date: Date) => formatDate(date)
    }
  ];

  return (
    <div>
      <Table columns={columns} dataSource={payouts} rowKey="_id" />
      <ViewTransactions isVisible={isModalVisible} onClose={() => setIsModalVisible(false)} transactions={selectedTransactions} />
    </div>
  );
};

export default InstructorPayout;
