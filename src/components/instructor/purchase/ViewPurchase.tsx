import React, { useEffect, useState } from "react";
import { Table, Tag } from "antd";
import { formatDate, moneyFormat } from "../../../utils/helper";
import { PurchaseStatus } from "../../../app/enums/purchase.status";
import PurchaseCheckbox from "./PurchaseCheckbox";
import { PurchaseService } from "../../../services/purchase/purchase.service";
import { SearchForInstructorPurchaseRequestModel } from "../../../models/api/request/purchase/purchase.request.model";
import { SearchForInstructorPurchaseResponseModel } from "../../../models/api/responsive/purchase/purchase.reponse.model";

interface ViewPurchaseProps {
  searchQuery: string;
  filterStatus: string;
  onSelectionChange: (selected: Set<string>) => void;
  refreshKey: number;
}

const ViewPurchase: React.FC<ViewPurchaseProps> = ({ searchQuery, filterStatus, onSelectionChange, refreshKey }) => {
  const [selectedPurchases, setSelectedPurchases] = useState<Set<string>>(new Set());
  const [purchases, setPurchases] = useState<SearchForInstructorPurchaseResponseModel["pageData"]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [pageInfo, setPageInfo] = useState<any>({});
  const [loading, setLoading] = useState(false);

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
        pageNum: currentPage,
        pageSize: pageSize
      }
    };

    try {
      setLoading(true);
      const response = await PurchaseService.searchForInstructorPurchase(params);
      setPurchases(response.data.data.pageData);
      setPageInfo(response.data.data.pageInfo);
    } catch (error) {
      console.error("Failed to fetch purchases", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPurchases();
  }, [searchQuery, filterStatus, refreshKey, currentPage, pageSize]);

  const handleSelectAllChange = (checked: boolean) => {
    setSelectedPurchases(checked ? new Set(purchases.map((purchase) => purchase._id)) : new Set());
    onSelectionChange(checked ? new Set(purchases.map((purchase) => purchase._id)) : new Set());
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
      title: <PurchaseCheckbox 
               checked={selectedPurchases.size === purchases.length} 
               onChange={handleSelectAllChange}
             />,
      dataIndex: "_id",
      key: "select",
      render: (id: string, record: any) => (
        <PurchaseCheckbox 
          checked={selectedPurchases.has(id)} 
          onChange={(checked) => handleCheckboxChange(id, checked)} 
          disabled={record.status === PurchaseStatus.REQUEST_PAID || record.status === PurchaseStatus.COMPLETED} 
        />
      )
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
          case PurchaseStatus.NEW:
            color = "blue";
            text = "new";
            break;
          case PurchaseStatus.REQUEST_PAID:
            color = "orange";
            text = "request_paid";
            break;
          case PurchaseStatus.COMPLETED:
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
      render: (money: number) => <div className="flex justify-end font-semibold text-emerald-600">{moneyFormat(money)}</div>
    },
    {
      title: "Price",
      dataIndex: "price",
      key: "price",
      render: (money: number) => <div className="flex justify-end font-semibold text-gray-600">{moneyFormat(money)}</div>
    },
    {
      title: "Discount",
      dataIndex: "discount",
      key: "discount",
      render: (money: number) => <div className="flex justify-end font-semibold text-indigo-600">{money + "% OFF"}</div>
    },
    {
      title: "Created At",
      dataIndex: "created_at",
      key: "created_at",
      render: (date: Date) => <span className="font-bold">{formatDate(date)}</span>
    },
  ];
    return (
      <div>
      <Table 
        loading={loading}
        columns={columns} 
        dataSource={purchases} 
        rowKey="_id" 
        pagination={{
          current: currentPage,
          pageSize: pageSize,
          total: pageInfo.totalItems,
          showTotal: (total, range) => `${range[0]}-${range[1]} of ${total} items`,
          onChange: (page, pageSize) => {
            setCurrentPage(page);
            if (pageSize) setPageSize(pageSize);
          },
          showSizeChanger: true,
          className: "bg-pagination",
          position: ["bottomLeft"]
        }}
      />
      </div>
    );
};

export default ViewPurchase;
