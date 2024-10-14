import { Button, Table, Tag } from "antd";
import payoutData from "../../../data/payouts.json";
import { formatDate, moneyFormat } from "../../../utils/helper";
import { Link } from "react-router-dom";
import { Payout, PayoutStatusEnum } from "../../../models/Payout";

const InstructorPayout = () => {
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
        <Link to={`/admin/payout/${record.id}`}>
          <Button className="bg-gradient-tone text-white">View Details</Button>
        </Link>
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
      <Table
        columns={columns}
        dataSource={payoutData.payments as unknown as Payout[]}
        rowKey="id"
      />
    </div>
  );
};

export default InstructorPayout;
