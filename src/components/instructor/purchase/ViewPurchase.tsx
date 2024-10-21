import React, { useState } from "react";
import { Table, Tag } from "antd";
import { formatDate, moneyFormat } from "../../../utils/helper";
import { PurchaseStatusEnum } from "../../../models/Purchases";
import { purchases } from "../../../data/purchases.json";
import PurchaseCheckbox from "./PurchaseCheckbox";
interface ViewPurchaseProps {
  searchQuery: string;
  filterStatus: string;
  onSelectionChange: (selectedPurchases: Set<string>) => void;
}

const ViewPurchase: React.FC<ViewPurchaseProps> = ({
  searchQuery,
  filterStatus,
  onSelectionChange,
}) => {
  const [selectedPurchases, setSelectedPurchases] = useState<Set<string>>(
    new Set()
  );

  const handleSelectAllChange = (checked: boolean) => {
    setSelectedPurchases(
      checked
        ? new Set(filteredPurchases.map((purchase) => purchase.id))
        : new Set()
    );
    onSelectionChange(
      checked
        ? new Set(filteredPurchases.map((purchase) => purchase.id))
        : new Set()
    );
  };

  const filteredPurchases = purchases.filter((item) => {
    const matchesSearchQuery = item.purchase_no.includes(searchQuery);
    const matchesStatus = filterStatus === "" || item.status === filterStatus;
    return matchesSearchQuery && matchesStatus;
  });

  const handleCheckboxChange = (id: string, checked: boolean) => {
    setSelectedPurchases(prev => {
      const newSet = new Set(prev);
      checked ? newSet.add(id) : newSet.delete(id);
      onSelectionChange(newSet);
      return newSet;
    });
  };

  const columns = [
    {
      title: (
        <PurchaseCheckbox
          checked={selectedPurchases.size === filteredPurchases.length}
          onChange={handleSelectAllChange}
        />
      ),
      dataIndex: "id",
      key: "select",
      render: (id: string) => (
        <PurchaseCheckbox
          checked={selectedPurchases.has(id)}
          onChange={(checked) => handleCheckboxChange(id, checked)}
        />
      ),
    },

    {
      title: "Purchase No",
      dataIndex: "purchase_no",
      key: "purchase_no",
    },
    {
      title: "Status",
      dataIndex: "status",
      key: "status",
      render: (status: string) => {
        let color = "";
        let text = "";

        switch (status) {
          case PurchaseStatusEnum.new:
            color = "blue";
            text = "new";
            break;
          case PurchaseStatusEnum.request_paid:
            color = "orange";
            text = "request_paid";
            break;
          case PurchaseStatusEnum.completed:
            color = "green";
            text = "completed";
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
      title: "Price Paid",
      dataIndex: "price_paid",
      key: "price_paid",
      render: (money: number) => moneyFormat(money),
    },
    {
      title: "Price",
      dataIndex: "price",
      key: "price",
      render: (money: number) => moneyFormat(money),
    },
    {
      title: "Discount",
      dataIndex: "discount",
      key: "discount",
      render: (money: number) => money + "%",
    },

    {
      title: "Created At",
      dataIndex: "created_at",
      key: "created_at",
      render: (date: Date) => formatDate(date),
    },
    {
      title: "Updated At",
      dataIndex: "updated_at",
      key: "updated_at",
      render: (date: Date) => formatDate(date),
    },
  ];

  const filteredData = purchases.filter((item) => {
    const matchesSearchQuery = item.purchase_no.includes(searchQuery);
    const matchesStatus = filterStatus === "" || item.status === filterStatus;
    return matchesSearchQuery && matchesStatus;
  });

  return (
    <div>
      <Table columns={columns} dataSource={filteredData} rowKey="purchase_no" />
    </div>
  );
};

export default ViewPurchase;
