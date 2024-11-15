import React, { useState } from "react";
import { Modal, Table } from "antd";
import { formatDate, moneyFormat } from "../../../utils/helper";

interface ViewTransactionsProps {
  isVisible: boolean;
  onClose: () => void;
  transactions: any[];
}

const ViewTransactions: React.FC<ViewTransactionsProps> = ({ isVisible, onClose, transactions }) => {
  const [pageNum, setPageNum] = useState<number>(1);
  const [pageSize, setPageSize] = useState<number>(5);

  const columns = [
    // {
    //   title: "Transaction ID",
    //   dataIndex: "_id",
    //   key: "_id"
    // },
    // {
    //   title: "Purchase ID",
    //   dataIndex: "purchase_id",
    //   key: "purchase_id"
    // },
    {
      title: "Price",
      dataIndex: "price",
      key: "price",
      render: (amount: number | undefined) => (amount !== undefined ? moneyFormat(amount) : "N/A")
    },
    {
      title: "Discount",
      dataIndex: "discount",
      key: "discount"
    },
    {
      title: "Created At",
      dataIndex: "created_at",
      key: "created_at",
      render: (date: string) => (date ? formatDate(new Date(date)) : "N/A")
    }
  ];

  return (
    <Modal title="Transaction Details" open={isVisible} onCancel={onClose} footer={null} width={800}>
      <Table
        columns={columns}
        dataSource={transactions}
        rowKey="_id"
        pagination={{
          current: pageNum,
          pageSize: pageSize,
          total: transactions.length,
          showTotal: (total, range) => `${range[0]}-${range[1]} of ${total} items`,
          onChange: (page, pageSize) => {
            setPageNum(page);
            if (pageSize) setPageSize(pageSize);
          },
          showSizeChanger: true,
          className: "bg-pagination mr-10",
          position: ["bottomLeft"]
        }}
      />
    </Modal>
  );
};

export default ViewTransactions;
