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
      title: "Price Original",
      dataIndex: "price",
      key: "price",
      render: (money: number) => <div className="flex justify-end font-semibold text-emerald-600">{moneyFormat(money)}</div>
    },
    {
      title: "Price Paid",
      dataIndex: "price_paid",
      key: "price_paid",
      render: (money: number) => <div className="flex justify-end font-semibold text-gray-600">{moneyFormat(money)}</div>
    },
    {
      title: "Discount",
      dataIndex: "discount",
      key: "discount",
      render: (discount: number) => <div className="flex justify-end font-semibold text-indigo-600">{discount + "% OFF"}</div>
    },
    {
      title: "Date Created",
      dataIndex: "created_at",
      key: "created_at",
      render: (date: string) => <span className="font-bold">{formatDate(new Date(date))}</span>
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
