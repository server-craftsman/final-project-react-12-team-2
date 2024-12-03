import { useState, useEffect } from "react";
import { Table, Tag } from "antd";
import { formatDate, moneyFormat } from "../../../utils/helper";
import { SearchForAdminPurchasesRequestModel } from "../../../models/api/request/purchase/purchase.request.model";
import { SearchForAdminPurchasesResponseModel } from "../../../models/api/responsive/purchase/purchase.reponse.model";
import { PurchaseService } from "../../../services/purchase/purchase.service";
import { ColorPurchaseStatusEnum } from "../../../utils/purchasesStatus";
import { PurchaseStatus } from "../../../app/enums/purchase.status";
import PurchaseCheckbox from "../../instructor/purchase/PurchaseCheckbox";
import moment from "moment";
import { ColumnType } from "antd/es/table";
import { notificationMessage } from "../../../utils/helper";

interface PurchasesLogProps {
  onSelectionChange: (selected: Set<string>) => void;
  onInstructorIdChange: (id: string) => void;
  searchQuery: string;
  statusFilter: string;
  refreshKey: number;
  instructorId: string;
  startDate: moment.Moment | null;
  endDate: moment.Moment | null;
}

const PurchasesLog: React.FC<PurchasesLogProps> = ({ onSelectionChange, onInstructorIdChange, searchQuery, statusFilter, refreshKey, instructorId, startDate, endDate }) => {
  const [filteredPurchases, setFilteredPurchases] = useState<SearchForAdminPurchasesResponseModel["pageData"]>([]);
  const [selectedPurchases, setSelectedPurchases] = useState<Set<string>>(new Set());
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [pageInfo, setPageInfo] = useState<any>({});

  useEffect(() => {
    setSelectedPurchases(new Set());
  }, [refreshKey]);

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
      if (startDate && endDate) {
        response.data.data.pageData = response.data.data.pageData.filter((purchase) => {
          const purchaseDate = moment(purchase.created_at);
          return purchaseDate >= startDate && purchaseDate <= endDate;
        });
      }
      setFilteredPurchases(response.data.data.pageData);
      setPageInfo(response.data.data.pageInfo);
    } catch (error) {
      console.error("Failed to fetch purchases", error);
    }
  };

  useEffect(() => {
    fetchPurchases();
  }, [searchQuery, statusFilter, refreshKey, currentPage, pageSize, instructorId, startDate, endDate]);

  const handleSelectAllChange = (checked: boolean) => {
    setSelectedPurchases(checked ? new Set(filteredPurchases.map((purchase) => purchase._id)) : new Set());
    onSelectionChange(checked ? new Set(filteredPurchases.map((purchase) => purchase._id)) : new Set());
  };

  const handleCheckboxClick = (purchaseId: string, instructorId: string) => {
    const newSelectedPurchases = new Set(selectedPurchases);
    if (newSelectedPurchases.has(purchaseId)) {
      newSelectedPurchases.delete(purchaseId);
    } else {
      if (newSelectedPurchases.size === 0 || Array.from(newSelectedPurchases).every(id => filteredPurchases.find(p => p._id === id)?.instructor_id === instructorId)) {
        newSelectedPurchases.add(purchaseId);
      } else {
        notificationMessage("You can only select purchases from the same instructor.", "warning");
        return;
      }
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
      title: "Student Name",
      dataIndex: "student_name",
      key: "student_name"
    },
    {
      title: "Instructor Name",
      dataIndex: "instructor_name",
      key: "instructor_name",
      render: (instructor_name: string) => (
        <div className="flex items-center">
          <img
            src={`https://ui-avatars.com/api/?name=${instructor_name[0]}`}
            alt="Avatar"
            className="h-10 w-10 rounded-full"
            onError={(e) => {
              e.currentTarget.src = `https://ui-avatars.com/api/?name=${instructor_name[0]}`;
            }}
          />
          <span className="ml-2">{instructor_name}</span>
        </div>
      )
    },
    {
      title: "Price Paid",
      dataIndex: "price_paid",
      key: "price_paid",
      render: (price_paid: number) => <div style={{ textAlign: "right" }}>{moneyFormat(price_paid)}</div>
    },
    {
      title: "Discount",
      dataIndex: "discount",
      key: "discount",
      render: (discount: number) => {
        return <div style={{ textAlign: "right" }}>{`${discount}% OFF`}</div>;
      },
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
    return (
      <div>
        <Table 
          columns={columns as ColumnType<any>[]} 
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
          summary={() => (
            <Table.Summary.Row>
              <Table.Summary.Cell index={0} colSpan={10}>Total: {pageInfo.totalItems} purchases</Table.Summary.Cell>
            </Table.Summary.Row>
          )}
        />
      </div>
    );
};

export default PurchasesLog;
