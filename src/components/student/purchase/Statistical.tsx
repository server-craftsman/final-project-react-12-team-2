import React, { useMemo } from "react";
import { Table, Button, Card } from "antd";
import { ArrowLeftOutlined } from "@ant-design/icons";
import moment from "moment";
import { helpers } from "../../../utils";
import { useNavigate } from "react-router-dom";
import { ROUTER_URL } from "../../../const/router.path";

interface Purchase {
  purchase_no: string;
  price_paid: number;
  created_at: string;
  // Add other relevant fields as needed
}

interface StatisticalProps {
  purchases: Purchase[];
}

const Statistical: React.FC<StatisticalProps> = ({ purchases }) => {
  const navigate = useNavigate();

  // Group purchases by month
  const monthlyStatistics = useMemo(() => {
    const stats: Record<string, { totalPurchases: number; totalRevenue: number }> = {};

    purchases.forEach((purchase) => {
      const month = moment(purchase.created_at).format("YYYY-MM");
      if (!stats[month]) {
        stats[month] = { totalPurchases: 0, totalRevenue: 0 };
      }
      stats[month].totalPurchases += 1;
      stats[month].totalRevenue += purchase.price_paid;
    });

    return Object.entries(stats).map(([month, data]) => ({
      month,
      ...data,
    }));
  }, [purchases]);

  const columns = [
    {
      title: "Month",
      dataIndex: "month",
      key: "month",
      render: (text: string) => <span style={{ fontWeight: 'bold', color: '#3e2723' }}>{text}</span>,
    },
    {
      title: "Total Purchases",
      dataIndex: "totalPurchases",
      key: "totalPurchases",
      render: (text: number) => <span style={{ color: '#5d4037' }}>{text}</span>,
    },
    {
      title: "Total Spending",
      dataIndex: "totalRevenue",
      key: "totalRevenue",
      render: (revenue: number) => (
        <span style={{ color: '#b71c1c', fontWeight: 'bold' }}>
          {helpers.moneyFormat(revenue)}
        </span>
      ),
    },
  ];

  return (
    <Card
      bordered={false}
      className="shadow-md rounded-lg p-6 bg-gray-100"
    >
      <div className="flex flex-col md:flex-row justify-between items-center mb-6">
        <h2 className="text-2xl md:text-3xl font-bold text-brown-900 mb-4 md:mb-0">Monthly Statistics</h2>
        <Button
          type="primary"
          onClick={() => navigate(ROUTER_URL.STUDENT.BASE)}
          className="bg-indigo-900 border-indigo-900 text-white"
          icon={<ArrowLeftOutlined />}
        >
          Back to Purchase List
        </Button>
      </div>
      <Table
        dataSource={monthlyStatistics}
        columns={columns}
        rowKey="month"
        pagination={false}
        className="bg-white rounded-md"
      />
    </Card>
  );
};

export default Statistical;