import Table, { ColumnsType } from "antd/es/table";
// import { courseStatusColor } from "../../../../utils/courseStatus";
import { formatDate, moneyFormat } from "../../../../utils/helper";
import { CourseStatusBadge } from "../../../../utils/courseStatus";
import { StatusType } from "../../../../app/enums";
import { useEffect, useState, useCallback } from "react";
import { Button, message, Modal, Pagination } from "antd";
import CustomSearch from "../../../generic/search/CustomSearch";
// import EditButton from "./EditButton";
// import DeleteButton from "./DeleteButton";
import CreateCourseButton from "./CreateButton";
import FilterStatus from "./FilterStatus";
import useCourseCache from "../../../../hooks/useCourseCache";
import { GetCourseResponsePageData } from "../../../../models/api/responsive/course/course.response.model";

const DisplayCourse: React.FC<{
  searchTerm: string;
  statusFilter: StatusType | "";
  onSearch: (value: string) => void;
  onStatusChange: (status: StatusType | "") => void
}> = ({ searchTerm, statusFilter, onSearch, onStatusChange }) => {
  const [pageNum, setPageNum] = useState<number>(1);
  const [pageSize, setPageSize] = useState<number>(10);
  const [selectedRowKeys, setSelectedRowKeys] = useState<number[]>([]);
  const [selectedCourse, setSelectedCourse] = useState([]);
  const [isModalVisible, setIsModalVisible] = useState(false);
  
  // Use the custom hook to fetch courses
  const { courses, totalItems } = useCourseCache(searchTerm, statusFilter as StatusType | "", pageNum, pageSize);

  // const getCourseStatusName = (status: StatusType): string => {
  //   return courseStatusColor[status] || "Unknown status";
  // };

  useEffect(() => {
    setSelectedCourse(selectedRowKeys as unknown as any);
  }, [selectedRowKeys, setSelectedCourse]);

  const handleSearch = (searchText: string) => {
    setPageNum(1);
    onSearch(searchText);
  };

  const columns: ColumnsType<GetCourseResponsePageData> = [
    {
      title: "Name",
      key: "name",
      dataIndex: "name"
    },
    {
      title: "Category Name",
      key: "category_name",
      dataIndex: "category_name"
    },
    {
      title: "Status",
      key: "status",
      dataIndex: "status",
      render: (status: StatusType) => <CourseStatusBadge status={status} />
    },
    {
      title: "Price",
      key: "price",
      dataIndex: "price",
      render: (price: number) => moneyFormat(price)
    },
    {
      title: "Discount",
      key: "discount",
      dataIndex: "discount"
    },
    {
      title: "Created At",
      key: "created_at",
      dataIndex: "created_at",
      render: (text: Date) => formatDate(text)
    },
    {
      title: "Actions",
      key: "actions",
      dataIndex: "actions",
    }
  ];

  const rowSelection = {
    selectedRowKeys,
    onChange: (selectedRowKeys: React.Key[]) => {
      setSelectedRowKeys(selectedRowKeys as number[]);
    }
  };

  const showModal = () => {
    setIsModalVisible(true);
  };

  const handleOk = () => {
    setIsModalVisible(false);
    message.info("Sending to admin");
  };

  const handleCancel = () => {
    setIsModalVisible(false);
  };

  // Thêm callback để refresh data
  const handleCourseCreated = useCallback(() => {
    // Reset về trang 1 khi có course mới
    setPageNum(1);
  }, []);

  return (
    <>
      <div className="mb-4 mt-4 flex justify-between">
        <CustomSearch
          onSearch={handleSearch}
          placeholder="Search by course name"
          className="w-1/5"
        />
        <FilterStatus onStatusChange={onStatusChange as any} />
        <div className="flex justify-end gap-2">
          <CreateCourseButton onCourseCreated={handleCourseCreated} />
          <Button 
            disabled={selectedCourse.length === 0} 
            onClick={showModal}
            className="bg-gradient-tone text-white hover:opacity-90"
          >
            Send to Admin
          </Button>
        </div>
      </div>
      <Table 
        rowSelection={rowSelection} 
        columns={columns} 
        dataSource={courses} 
        rowKey="id"
        pagination={false}
      />
      <div className="mt-5 flex justify-end">
        <Pagination
          current={pageNum}
          pageSize={pageSize}
          total={totalItems}
          showTotal={(total, range) => `${range[0]}-${range[1]} of ${total} items`}
          onChange={(page, pageSize) => {
            setPageNum(page);
            setPageSize(pageSize);
          }}
          showSizeChanger
          className="bg-pagination"
        />
      </div>
      <Modal 
        title="Confirm" 
        open={isModalVisible} 
        onOk={handleOk} 
        onCancel={handleCancel} 
        okText="Yes" 
        cancelText="No"
        okButtonProps={{ className: "bg-gradient-tone" }}
      >
        <p>Are you sure you want to send the selected courses to admin?</p>
      </Modal>
    </>
  );
};

export default DisplayCourse;
