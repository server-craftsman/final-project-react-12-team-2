import React, { useEffect, useState } from "react";
import { Typography, Table, Spin } from "antd";
import { PayoutService } from "../../../services/payout/payout.service";
import { GetPayoutResponseModel } from "../../../models/api/responsive/payout/payout.response.model";
import { helpers } from "../../../utils";
import { LineChart, Line, CartesianGrid, Tooltip, ResponsiveContainer, Legend, XAxis, YAxis } from 'recharts';
// import DatePicker from 'react-datepicker';
// import "react-datepicker/dist/react-datepicker.css";

// const filterTransactionsByDate = (transactions: GetPayoutResponseModel[]) => {
//   const currentDate = new Date();
//   const startOfDay = new Date(currentDate.setHours(0, 0, 0, 0));
//   const endOfDay = new Date(currentDate.setHours(23, 59, 59, 999));

//   return transactions.filter(transaction => {
//     const createdAt = new Date(transaction.pageData?.created_at as Date);
//     return createdAt >= startOfDay && createdAt <= endOfDay;
//   });
// }

const LatestTransaction: React.FC = () => {
  const [latestTransaction, setLatestTransaction] = useState<GetPayoutResponseModel[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  const fetchLatestTransaction = async () => {
    setIsLoading(true); // Start loading
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
    setIsLoading(false); // End loading
  };

  // const filteredTransactions = filterTransactionsByDate(latestTransaction);

  const columns = [
    {
      title: "Payout No",
      dataIndex: "payout_no",
      key: "payout_no",
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
    },
    {
      title: "Payout Date",
      dataIndex: "created_at",
      key: "created_at",
      sorter: (a: any, b: any) => new Date(a.created_at).getTime() - new Date(b.created_at).getTime(),
      defaultSortOrder: "ascend" as const,
      render: (created_at: any) => helpers.formatDate(created_at),
      onCell: () => ({
        style: {
          cursor: "pointer"
        }
      })
    },
  ];

  useEffect(() => {
    fetchLatestTransaction();
  }, []);

  return (
    <Spin spinning={isLoading} tip="Loading...">
      <div className="flex-1 rounded-sm border border-gray-200 bg-white px-4 pb-4 pt-3">
        <div className="mt-5 flex flex-col gap-4">
          <Typography.Text strong className="text-gray-700">
            Payout Chart
          </Typography.Text>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={latestTransaction}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis 
                dataKey="created_at" 
                tickFormatter={(value: any) => helpers.formatDate(value, "DD-MM-YYYY")}
                reversed={true}
              />
              <YAxis />
              <Tooltip />
              <Legend />
              <Line type="monotone" dataKey="balance_instructor_received" stroke="#8884d8" name="Balance Received" />
              <Line type="monotone" dataKey="balance_instructor_paid" stroke="#82ca9d" name="Balance Paid" />
            </LineChart>
          </ResponsiveContainer>
        </div>
        <Typography.Text strong className="text-gray-700">
          Recent Transactions
        </Typography.Text>
        <div className="mt-3">
          <Table 
            columns={columns} 
            dataSource={latestTransaction} 
            rowKey={(record) => {
              const id = record.pageData?._id;
              const payoutNo = record.pageData?.payout_no;
              return id && payoutNo ? `${id}-${payoutNo}` : Math.random().toString(36).substr(2, 9);
            }}
            pagination={false} 
          />
        </div>
      </div>
    </Spin>
  );  
};

export default LatestTransaction;
