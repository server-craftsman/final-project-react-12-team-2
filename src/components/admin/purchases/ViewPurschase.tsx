import { Table, Tag } from "antd";
import { useNavigate } from "react-router-dom";
import purchasesData from "../../../data/purchases.json";
import {
  Purchases,
  PurchaseStatusEnum,
} from "../../../models/prototype/Purchases";
import { Key } from "react";

const ViewPurchase = ({ searchQuery }: { searchQuery: string }) => {
  const navigate = useNavigate();

  const handleViewDetails = (purchaseId: string) => {
    navigate(`/admin/view-purchase/${purchaseId}`); // Điều hướng tới trang chi tiết với ID
  };

  const mapStatus = (status: string): PurchaseStatusEnum => {
    switch (status) {
      case "new":
        return PurchaseStatusEnum.new;
      case "request_paid":
        return PurchaseStatusEnum.request_paid;
      case "completed":
        return PurchaseStatusEnum.completed;
      default:
        throw new Error("Unknown status");
    }
  };

  const convertedPurchasesData = purchasesData.purchases.map((purchase) => ({
    ...purchase,
    status: mapStatus(purchase.status), // Convert status to enum
    created_at: new Date(purchase.created_at),
    updated_at: new Date(purchase.updated_at),
  }));

  const filteredPurchases = convertedPurchasesData.filter(
    (purchase: Purchases) =>
      purchase.purchase_no.toLowerCase().includes(searchQuery.toLowerCase()) ||
      purchase.cart_id.toLowerCase().includes(searchQuery.toLowerCase()),
  );

  const columns = [
    {
      title: "Purchase No",
      dataIndex: "purchase_no",
      key: "purchase_no",
    },
    {
      title: "Price Paid",
      dataIndex: "price_paid",
      key: "price_paid",
      render: (amount: number) => `$${amount.toFixed(2)}`, // Format as currency
    },
    {
      title: "Price",
      dataIndex: "price",
      key: "price",
      render: (amount: number) => `$${amount.toFixed(2)}`, // Format as currency
    },
    {
      title: "Discount",
      dataIndex: "discount",
      key: "discount",
      render: (amount: number) => `${amount.toFixed(2)}%`,
    },
    {
      title: "Status",
      dataIndex: "status",
      key: "status",
      filters: [
        { text: "New", value: PurchaseStatusEnum.new },
        { text: "Request Paid", value: PurchaseStatusEnum.request_paid },
        { text: "Completed", value: PurchaseStatusEnum.completed },
      ],
      onFilter: (value: boolean | Key, record: Purchases) => {
        // Cast value to Key if it's not a boolean
        return record.status === (value as Key);
      },
      render: (status: PurchaseStatusEnum) => {
        let color = "";
        let statusText = "";

        switch (status) {
          case PurchaseStatusEnum.new:
            color = "blue";
            statusText = "New";
            break;
          case PurchaseStatusEnum.request_paid:
            color = "orange";
            statusText = "Request Paid";
            break;
          case PurchaseStatusEnum.completed:
            color = "green";
            statusText = "Completed";
            break;
          default:
            color = "gray";
            statusText = "Unknown";
        }

        return <Tag color={color}>{statusText}</Tag>;
      },
    },
    {
      title: "Created At",
      dataIndex: "created_at",
      key: "created_at",
      render: (date: Date) => date.toLocaleDateString(), // Format the date
    },
    {
      title: "Action",
      key: "action",
      render: (_: unknown, record: Purchases) => (
        <div>
          <button
            onClick={() => handleViewDetails(record.id)} // Khi nhấn, sẽ điều hướng tới trang chi tiết
            className="bg-gradient-tone rounded-md px-4 py-2 text-white"
          >
            View Details
          </button>
        </div>
      ),
    },
  ];

  return (
    <div className="p-4">
      <Table<Purchases>
        className="shadow-lg"
        columns={columns}
        dataSource={filteredPurchases}
        rowKey="id"
        pagination={{ pageSize: 10 }}
      />
    </div>
  );
};

export default ViewPurchase;
