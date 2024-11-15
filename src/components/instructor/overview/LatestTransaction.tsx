import React, { useEffect, useState } from "react";
import { Typography, Table } from "antd";
import { PayoutService } from "../../../services/payout/payout.service";
import { GetPayoutResponseModel } from "../../../models/api/responsive/payout/payout.response.model";
// import { useAuth } from "../../../contexts/AuthContext";
import { helpers } from "../../../utils";
import { LineChart, Line, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from 'recharts';

const LatestTransaction: React.FC = () => {
  // const { userInfo } = useAuth();
  const [latestTransaction, setLatestTransaction] = useState<GetPayoutResponseModel[]>([]);

  const fetchLatestTransaction = async () => {
    const response = await PayoutService.getPayout({
      searchCondition: {
        instructor_id: "",
        is_instructor: true,
        status: "",
        is_delete: false,
        payout_no: ""
      },
      pageInfo: {
        pageNum: 1,
        pageSize: 10
      }
    });
    setLatestTransaction(response.data.data.pageData as unknown as GetPayoutResponseModel[]);
  };

  const columns = [
    {
      title: "Payout ID",
      dataIndex: "payout_no",
      key: "payout_no",
      render: (text: any) => `#${text}`,
      onCell: () => ({
        style: {
          cursor: "pointer"
        }
      })
    },
    {
      title: "Created At",
      dataIndex: "created_at",
      key: "created_at",
      sorter: (a: any, b: any) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime(),
      defaultSortOrder: "descend" as const,
      render: (created_at: any) => helpers.formatDate(created_at),
      onCell: () => ({
        style: {
          cursor: "pointer"
        }
      })
    },
    {
      title: "Balance Origin",
      dataIndex: "balance_origin",
      key: "balance_origin",
      render: (balance_origin: any) => helpers.moneyFormat(balance_origin),
      onCell: () => ({
        style: {
          cursor: "pointer"
        }
      })
    },
    {
      title: "Balance Received",
      dataIndex: "balance_instructor_received",
      key: "balance_instructor_received",
      render: (price: any) => price !== undefined ? helpers.moneyFormat(price) : "N/A",
      onCell: () => ({
        style: {
          cursor: "pointer"
        }
      })
    },
    {
      title: "Balance Paid",
      dataIndex: "balance_instructor_paid",
      key: "balance_instructor_paid",
      render: (price_paid: any) => price_paid !== undefined ? helpers.moneyFormat(price_paid) : "N/A",
      onCell: () => ({
        style: {
          cursor: "pointer"
        }
      })
    }
  ];

  useEffect(() => {
    fetchLatestTransaction();
  }, []);

  return (
    <div className="flex-1 rounded-sm border border-gray-200 bg-white px-4 pb-4 pt-3">
      <Typography.Text strong className="text-gray-700">
        Recent Transactions
      </Typography.Text>
      <div className="mt-3">
        <Table 
          columns={columns} 
          dataSource={latestTransaction} 
          rowKey={(record) => record.pageData ? `${record.pageData._id}-${record.pageData.payout_no}` : 'unknown'}
          pagination={false} 
        />
      </div>
      <div className="mt-5">
        <Typography.Text strong className="text-gray-700">
          Payout Chart
        </Typography.Text>
        <ResponsiveContainer width="100%" height={300}>
          <LineChart data={latestTransaction}>
            <CartesianGrid strokeDasharray="3 3" />
            <Tooltip />
            <Legend />
            <Line type="monotone" dataKey="balance_instructor_received" stroke="#8884d8" name="Balance Received" />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </div>
  );  
};

export default LatestTransaction;
