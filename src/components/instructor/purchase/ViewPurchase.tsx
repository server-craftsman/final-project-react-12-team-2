import React, { useEffect, useState } from "react";
import { Table, Tag } from "antd";
import { formatDate, moneyFormat } from "../../../utils/helper";
import { PurchaseStatusEnum } from "../../../models/prototype/Purchases";
import PurchaseCheckbox from "./PurchaseCheckbox";
import { PurchaseService } from "../../../services/purchase/purchase.service";
import { SearchForInstructorPurchaseRequestModel } from "../../../models/api/request/purchase/purchase.request.model";
import { SearchForInstructorPurchaseResponseModel } from "../../../models/api/responsive/purchase/purchase.reponse.model";
interface ViewPurchaseProps {
  searchQuery: string;
  filterStatus: string;
  onSelectionChange: (selectedPurchases: Set<string>) => void;
}

const ViewPurchase: React.FC<ViewPurchaseProps> = ({ searchQuery, filterStatus, onSelectionChange }) => {
  const [selectedPurchases, setSelectedPurchases] = useState<Set<string>>(new Set());
  const [purchases, setPurchases] = useState<SearchForInstructorPurchaseResponseModel["pageData"]>([]);

    const fetchPurchases = async () => {
      const params: SearchForInstructorPurchaseRequestModel = {
        searchCondition: {
          purchase_no: searchQuery,
          cart_no: "",
          course_id: "",
          status: filterStatus as any, // Adjust type as necessary
          is_delete: false
        },
        pageInfo: {
          pageNum: 1,
          pageSize: 10
        }
      };

      try {
        const response = await PurchaseService.searchForInstructorPurchase(params);
        setPurchases(response.data.data.pageData);
      } catch (error) {
        console.error("Failed to fetch purchases", error);
      }
    };
    useEffect(() => {
    fetchPurchases();
  }, [searchQuery, filterStatus]);

  const handleSelectAllChange = (checked: boolean) => {
    setSelectedPurchases(checked ? new Set(purchases.map((fetchPurchases) => fetchPurchases._id)) : new Set());
    onSelectionChange(checked ? new Set(purchases.map((fetchPurchases) => fetchPurchases._id)) : new Set());
  };

  const handleCheckboxChange = (id: string, checked: boolean) => {
    setSelectedPurchases((prev) => {
      const newSet = new Set(prev);
      checked ? newSet.add(id) : newSet.delete(id);
      onSelectionChange(newSet);
      return newSet;
    });
  };

  const columns = [
    {
      title: <PurchaseCheckbox checked={selectedPurchases.size === purchases.length} onChange={handleSelectAllChange} />,
      dataIndex: "_id",
      key: "select",
      render: (id: string) => <PurchaseCheckbox checked={selectedPurchases.has(id)} onChange={(checked) => handleCheckboxChange(id, checked)} />
    },
    {
      title: "Purchase No",
      dataIndex: "purchase_no",
      key: "purchase_no"
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
      }
    },
    {
      title: "Price Paid",
      dataIndex: "price_paid",
      key: "price_paid",
      render: (money: number) => moneyFormat(money)
    },
    {
      title: "Price",
      dataIndex: "price",
      key: "price",
      render: (money: number) => moneyFormat(money)
    },
    {
      title: "Discount",
      dataIndex: "discount",
      key: "discount",
      render: (money: number) => money + "%"
    },
    {
      title: "Created At",
      dataIndex: "created_at",
      key: "created_at",
      render: (date: Date) => formatDate(date)
    },
    {
      title: "Updated At",
      dataIndex: "updated_at",
      key: "updated_at",
      render: (date: Date) => formatDate(date)
    }
  ];

  return (
    <div>
      <Table columns={columns} dataSource={purchases} rowKey="_id" />
    </div>
  );
};

export default ViewPurchase;
