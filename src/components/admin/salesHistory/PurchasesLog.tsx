import { useState, useEffect } from "react";
import { Table, Tag } from "antd";
import { formatDate } from "../../../utils/helper";
import { SearchForAdminPurchasesRequestModel } from "../../../models/api/request/purchase/purchase.request.model";
import { SearchForAdminPurchasesResponseModel } from "../../../models/api/responsive/purchase/purchase.reponse.model";
import { PurchaseService } from "../../../services/purchase/purchase.service";
import { ColorPurchaseStatusEnum } from "../../../utils/purchasesStatus";
import { PurchaseStatus } from "../../../app/enums/purchase.status";
import PurchaseCheckbox from "../../instructor/purchase/PurchaseCheckbox";
import LoadingAnimation from "../../../app/UI/LoadingAnimation";
interface PurchasesLogProps {
  onSelectionChange: (selected: Set<string>) => void;
  onInstructorIdChange: (id: string) => void;
  searchQuery: string;
  statusFilter: string;
  refreshKey: number;
  instructorId: string;
}

const PurchasesLog: React.FC<PurchasesLogProps> = ({ onSelectionChange, onInstructorIdChange, searchQuery, statusFilter, refreshKey, instructorId }) => {
  const [filteredPurchases, setFilteredPurchases] = useState<SearchForAdminPurchasesResponseModel["pageData"]>([]);
  const [selectedPurchases, setSelectedPurchases] = useState<Set<string>>(new Set());
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [pageInfo, setPageInfo] = useState<any>({});

  const fetchPurchases = async () => {
    const params: SearchForAdminPurchasesRequestModel = {
      searchCondition: {
        purchase_no: searchQuery,
        cart_no: "",
        course_id: "",
        status: statusFilter,
        is_delete: false,
      },
      pageInfo: {
        pageNum: currentPage,
        pageSize: pageSize
      }
    };

    try {
      const response = await PurchaseService.searchForAdminPurchases(params);
      setFilteredPurchases(response.data.data.pageData);
      setPageInfo(response.data.data.pageInfo);
    } catch (error) {
      console.error("Failed to fetch purchases", error);
    }
  };

  useEffect(() => {
    fetchPurchases();
  }, [searchQuery, statusFilter, refreshKey, currentPage, pageSize, instructorId]);

  const handleSelectAllChange = (checked: boolean) => {
    setSelectedPurchases(checked ? new Set(filteredPurchases.map((purchase) => purchase._id)) : new Set());
    onSelectionChange(checked ? new Set(filteredPurchases.map((purchase) => purchase._id)) : new Set());
  };

  const handleCheckboxClick = (purchaseId: string, instructorId: string) => {
    const newSelectedPurchases = new Set(selectedPurchases);
    if (newSelectedPurchases.has(purchaseId)) {
      newSelectedPurchases.delete(purchaseId);
    } else {
      newSelectedPurchases.add(purchaseId);
    }
    setSelectedPurchases(newSelectedPurchases);
    onSelectionChange(newSelectedPurchases);

    onInstructorIdChange(instructorId);
  };

  const columns = [
    {
      title: <PurchaseCheckbox 
               checked={selectedPurchases.size === filteredPurchases.length} 
               onChange={handleSelectAllChange}
             />,
      dataIndex: "_id",
      key: "select",
      render: (id: string, record: any) => (
        <PurchaseCheckbox 
          checked={selectedPurchases.has(id)} 
          onChange={() => handleCheckboxClick(id, record.instructor_id)} 
          disabled={record.status === PurchaseStatus.REQUEST_PAID || record.status === PurchaseStatus.COMPLETED} 
        />
      )
    },
    {
      title: "Course Name",
      dataIndex: "course_name",
      key: "course_name"
    },
    {
      title: "Purchase Number",
      dataIndex: "purchase_no",
      key: "purchase_no"
    },
    {
      title: "Status",
      dataIndex: "status",
      key: "status",
      render: (status: PurchaseStatus) => {
        return <Tag color={ColorPurchaseStatusEnum[status as unknown as keyof typeof ColorPurchaseStatusEnum]}>{status}</Tag>;
      }
    },
    {
      title: "Price Paid",
      dataIndex: "price_paid",
      key: "price_paid"
    },
    {
      title: "Discount",
      dataIndex: "discount",
      key: "discount"
    },
    {
      title: "Student Name",
      dataIndex: "student_name",
      key: "student_name"
    },
    {
      title: "Instructor Name",
      dataIndex: "instructor_name",
      key: "instructor_name"
    },
    {
      title: "Created At",
      dataIndex: "created_at",
      key: "created_at",
      render: (created_at: Date) => {
        return formatDate(created_at);
      }
    }
  ];
  if (filteredPurchases && pageInfo.totalItems) {
    return (
      <div>
        <Table 
          columns={columns} 
          dataSource={filteredPurchases} 
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
  } else {
    return <LoadingAnimation />;
  }
};

export default PurchasesLog;
