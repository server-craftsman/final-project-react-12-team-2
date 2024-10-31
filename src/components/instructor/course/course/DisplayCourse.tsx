import Table, { ColumnsType } from "antd/es/table";
// import { courseStatusColor } from "../../../../utils/courseStatus";
import { formatDate, moneyFormat } from "../../../../utils/helper";
import { CourseStatusBadge } from "../../../../utils/courseStatus";
import { StatusType } from "../../../../app/enums";
import { useEffect, useState, useCallback } from "react";
import { Button, message, Modal, Pagination } from "antd";
import CustomSearch from "../../../generic/search/CustomSearch";
import EditButton from "./EditButton";
// import DeleteButton from "./DeleteButton";
import CreateCourseButton from "./CreateButton";
import FilterStatus from "./FilterStatus";
import useCourseCache from "../../../../hooks/useCourseCache";
import { GetCourseResponsePageData } from "../../../../models/api/responsive/course/course.response.model";
import { useCourseStore } from "../../../../hooks/useCallback";
import { CourseService } from "../../../../services/course/course.service";
import _ from "lodash";

const DisplayCourse: React.FC<{
  searchTerm: string;
  statusFilter: StatusType;
  onSearch: (value: string) => void;
  onStatusChange: (status: StatusType | "") => void;
}> = ({ searchTerm, statusFilter, onSearch, onStatusChange }) => {
  const [pageNum, setPageNum] = useState<number>(1);
  const [pageSize, setPageSize] = useState<number>(10);
  const [selectedRowKeys, setSelectedRowKeys] = useState<number[]>([]);
  const [selectedCourse, setSelectedCourse] = useState<number[]>([]);
  const [isModalVisible, setIsModalVisible] = useState(false);

  // Modify how we pass statusFilter to useCourseCache
  const { courses, totalItems } = useCourseCache(
    searchTerm,
    statusFilter as StatusType | "", // Convert empty string to undefined
    pageNum,
    pageSize
  );

  const refreshCourses = useCourseStore((state) => state.refreshCourses);

  // Add effect to reset pagination when filter changes
  useEffect(() => {
    setPageNum(1);
  }, [statusFilter]);

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
      render: (_, record) => (
        <EditButton 
          data={{
            ...record,
            category_id: record.category_id,
            description: record.description,
            content: record.content,
            image_url: record.image_url,
            video_url: record.video_url
          }} 
          onEditSuccess={refreshCourses}
        />
      )
    }
  ];

  const rowSelection = {
    selectedRowKeys,
    onChange: (selectedRowKeys: React.Key[]) => {
      setSelectedRowKeys(selectedRowKeys.map((key) => Number(key)));
    },
    getCheckboxProps: (record: GetCourseResponsePageData) => ({
      disabled: record.status !== StatusType.NEW,
      name: record.name
    })
  };

  const showModal = () => {
    setIsModalVisible(true);
  };

  const handleOk = async () => {
    try {
      const validCourses = courses?.filter((course) => selectedCourse.includes(Number(course._id)) && course.status === StatusType.NEW);

      if (!validCourses || validCourses.length === 0) {
        message.warning("No valid courses selected to send");
        return;
      }

      const chunks = _.chunk(validCourses, 5);

      for (const chunk of chunks) {
        await Promise.all(
          chunk.map((course) =>
            CourseService.changeStatusCourse({
              course_id: course._id,
              new_status: StatusType.WAITING_APPROVE,
              comment: ""
            })
          )
        );
      }

      setIsModalVisible(false);
      setSelectedRowKeys([]);
      message.success("Successfully sent courses to admin");
      refreshCourses();
    } catch (error) {
      message.error("Failed to send courses to admin");
    }
  };

  const handleCancel = () => {
    setIsModalVisible(false);
  };

  // Thêm callback để refresh data
  const handleCourseCreated = useCallback(async () => {
    setPageNum(1);
    await refreshCourses();
  }, [refreshCourses]);

  const handleStatusChange = (status: StatusType | "") => {
    setPageNum(1); // Reset to first page when filter changes
    onStatusChange(status);
  };

  return (
    <>
      <div className="mb-4 mt-4 flex justify-between">
        <CustomSearch onSearch={handleSearch} placeholder="Search by course name" className="w-1/5" />
        <FilterStatus
          onStatusChange={handleStatusChange}
          currentStatus={statusFilter} // Add current status prop
        />
        <div className="flex justify-end gap-2">
          <CreateCourseButton onCourseCreated={handleCourseCreated} />
          <Button disabled={selectedCourse.length === 0} onClick={showModal} className="bg-gradient-tone text-white hover:opacity-90">
            Send to Admin
          </Button>
        </div>
      </div>
      <Table rowSelection={rowSelection} columns={columns} dataSource={courses} rowKey={(record) => record._id} pagination={false} />
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
      <Modal title="Confirm" open={isModalVisible} onOk={handleOk} onCancel={handleCancel} okText="Yes" cancelText="No" okButtonProps={{ className: "bg-gradient-tone" }}>
        <p>Are you sure you want to send the selected courses to admin?</p>
      </Modal>
    </>
  );
};

export default DisplayCourse;
