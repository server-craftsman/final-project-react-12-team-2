import { Button, Table } from "antd";
import payoutData from "../../../data/payouts.json";
import { formatDate, moneyFormat } from "../../../utils/helper";
import { Link } from "react-router-dom";

const ManagePayout = () => {
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
      render: () => (
        <Link to="">
          <Button className="bg-gradient-tone text-white">View Details</Button>
        </Link>
      ),
    },
    {
      title: "Status",
      dataIndex: "status",
      key: "status",
    },
    {
      title: "Balance Origin",
      dataIndex: "balance_origin",
      key: "balance_origin",
      render: (money: number) => moneyFormat(money),
    },
    {
      title: "Instructor Paid",
      dataIndex: "balance_instructor_paid",
      key: "balance_instructor_paid",
      render: (money: number) => moneyFormat(money),
    },
    {
      title: "Instructor Received",
      dataIndex: "balance_instructor_received",
      key: "balance_instructor_received",
      render: (money: number) => moneyFormat(money),
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
      <Table columns={columns} dataSource={payoutData.payments} />
    </div>
  );
};

export default ManagePayout;
