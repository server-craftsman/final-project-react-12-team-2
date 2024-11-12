import React from "react";
import { Modal, Table } from "antd";
import { moneyFormat, formatDate } from "../../../utils/helper";

interface ModalTransactionProps {
  isVisible: boolean;
  onClose: () => void;
  data: any[];
}

const ModalTransaction: React.FC<ModalTransactionProps> = ({ isVisible, onClose, data }) => {
  const detailColumns = [
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
      title: "Balance Amount",
      dataIndex: "price",
      key: "price",
      render: (money: number) => moneyFormat(money)
    },
    {
      title: "Balance Amount Paid",
      dataIndex: "price_paid",
      key: "price_paid",
      render: (money: number) => moneyFormat(money)
    },
    {
      title: "Date Created",
      dataIndex: "created_at",
      key: "created_at",
      render: (date: string) => formatDate(new Date(date))
    }
  ];

  return (
    <Modal
      title="Payout Details"
      open={isVisible}
      onCancel={onClose}
      footer={null}
      width={1000}
    >
      <Table
        columns={detailColumns}
        dataSource={data}
        rowKey={(record: any) => record._id || `row-${record.purchase_id}`}
        pagination={false}
      />
    </Modal>
  );
};

export default ModalTransaction;
