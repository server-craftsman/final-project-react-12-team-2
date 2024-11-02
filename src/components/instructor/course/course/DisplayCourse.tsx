import Table, { ColumnsType } from "antd/es/table";
import { EditOutlined } from "@ant-design/icons";
// import { courseStatusColor } from "../../../../utils/courseStatus";
import { formatDate, moneyFormat } from "../../../../utils/helper";
import { CourseStatusBadge } from "../../../../utils/courseStatus";
import { StatusType } from "../../../../app/enums";
import { useEffect, useState, useCallback } from "react";
import { Button, message, Modal, Pagination } from "antd";
import CustomSearch from "../../../generic/search/CustomSearch";
import EditButton from "./EditButton";
import DeleteButton from "./DeleteButton";
import CreateCourseButton from "./CreateButton";
import FilterStatus from "./FilterStatus";
import useCourseCache from "../../../../hooks/useCourseCache";
import { GetCourseResponsePageData } from "../../../../models/api/responsive/course/course.response.model";
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
  const [courseDetails, setCourseDetails] = useState<any>(null);
  const [refreshKey, setRefreshKey] = useState<number>(0);

  const getCourseData = useCallback(() => {
    return useCourseCache(
      searchTerm,
      statusFilter as StatusType | "",
      pageNum,
      pageSize,
      refreshKey
    );
  }, [searchTerm, statusFilter, pageNum, pageSize, refreshKey]);

  const { courses, totalItems } = getCourseData();

  const handleCourseCreated = () => {
    setRefreshKey((prevKey) => prevKey + 1);
  };

  useEffect(() => {
    setPageNum(1);
  }, [statusFilter]);

  useEffect(() => {
    setSelectedCourse(selectedRowKeys as unknown as any);
  }, [selectedRowKeys, setSelectedCourse]);

  const handleSearch = (searchText: string) => {
    setPageNum(1);
    onSearch(searchText);
  };

  const fetchCourseDetails = async (courseId: string) => {
    try {
      const details = await CourseService.getCourseById(courseId);
      setCourseDetails(details.data.data);
    } catch (error) {
      message.error("Failed to fetch course details");
    }
  };

  const columns: ColumnsType<GetCourseResponsePageData> = [
    {
      title: "No",
      key: "_id", 
      dataIndex: "_id",
      render: (_, __, index: number) => <span className="text-gray-500">{index + 1}</span>
    },
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
        <>
          <Button
            icon={<EditOutlined />}
            onClick={() => fetchCourseDetails(record._id)}
          />
          <DeleteButton courseId={record._id} onDeleteSuccess={handleCourseCreated} />
        </>
      )
    }
  ];

  // const toggleSelectAll = async (e: React.ChangeEvent<HTMLInputElement>) => {
  //   const allCourseIds = courses?.map(course => Number(course._id)) || [];
  //   const selectedKeys = e.target.checked ? allCourseIds : [];
  //   setSelectedRowKeys(selectedKeys);

  //   if (e.target.checked) {
  //     const validCourses = courses?.filter(course =>
  //       _.includes(selectedKeys, Number(course._id)) &&
  //       course.status === StatusType.NEW
  //     );

  //     if (!validCourses?.length) {
  //       message.warning("No valid courses selected to send");
  //       return;
  //     }

  //     const updateStatus = async (courseChunk: typeof validCourses) => {
  //       return Promise.all(
  //         courseChunk.map(course =>
  //           CourseService.changeStatusCourse({
  //             course_id: course._id,
  //             new_status: StatusType.WAITING_APPROVE,
  //             comment: ""
  //           })
  //         )
  //       );
  //     };

  //     const chunkSize = 5; // Customize as needed for API rate limits
  //     for (let i = 0; i < validCourses.length; i += chunkSize) {
  //       const chunk = validCourses.slice(i, i + chunkSize);
  //       await updateStatus(chunk); // Await each batch completion
  //     }

  //     message.success("Successfully sent courses to admin");
  //   }
  // };
  
  const rowSelection = {
    type: 'checkbox' as const,
    selectedRowKeys,
    onChange: (selectedRowKeys: React.Key[]) => {
      const numericKeys = selectedRowKeys.map(key => Number(key));
      setSelectedRowKeys(numericKeys);

      // message.info({
      //   content: `${numericKeys.length} course(s) selected`,
      //   icon: <CheckOutlined style={{ color: '#52c41a' }} />,
      //   className: 'animate-bounce'
      // });
    }
  };

  const rowClassName = (record: GetCourseResponsePageData) => {
    return selectedRowKeys.includes(Number(record._id)) ? 'bg-white' : 'bg-gray-50';
  };

  const handleOk = useCallback(async () => {
    try {
      const validCourses = courses?.filter(course =>
        selectedCourse.includes(Number(course._id)) &&
        course.status === StatusType.NEW
      );
  
      if (!validCourses?.length) {
        message.warning("No valid courses selected to send");
        return;
      }
  
      const updateStatus = async (courseChunk: typeof validCourses) => {
        return Promise.all(
          courseChunk.map(course =>
            CourseService.changeStatusCourse({
              course_id: course._id,
              new_status: StatusType.WAITING_APPROVE,
              comment: ""
            })
          )
        );
      };
  
      const chunkSize = 5; // Customize as needed for API rate limits
      for (let i = 0; i < validCourses.length; i += chunkSize) {
        const chunk = validCourses.slice(i, i + chunkSize);
        await updateStatus(chunk); // Await each batch completion
      }
  
      setIsModalVisible(false);
      setSelectedRowKeys([]);
      message.success("Successfully sent courses to admin");
    } catch (error) {
      message.error("Failed to send courses to admin");
    }
  }, [courses, selectedCourse, setIsModalVisible, setSelectedRowKeys, setRefreshKey]);

  const handleCancel = () => {
    setIsModalVisible(false);
  };

  const handleStatusChange = (status: StatusType | "") => {
    setPageNum(1);
    onStatusChange(status);
  };

  const sendToAdmin = useCallback(async () => {
    try {
      const validCourses = courses?.filter(course =>
        selectedRowKeys.includes(Number(course._id)) &&
        course.status === StatusType.NEW
      );

      if (!validCourses?.length) {
        message.warning("No valid courses selected to send");
        return;
      }

      const updateStatus = async (courseChunk: typeof validCourses) => {
        return Promise.all(
          courseChunk.map(course =>
            CourseService.changeStatusCourse({
              course_id: course._id,
              new_status: StatusType.WAITING_APPROVE,
              comment: ""
            })
          )
        );
      };

      const chunkSize = 5; // Customize as needed for API rate limits
      for (let i = 0; i < validCourses.length; i += chunkSize) {
        const chunk = validCourses.slice(i, i + chunkSize);
        await updateStatus(chunk); // Await each batch completion
      }

      handleCourseCreated();
      message.success("Successfully sent courses to admin");
    } catch (error) {
      message.error("Failed to send courses to admin");
    }
  }, [courses, selectedRowKeys, handleCourseCreated]);

  const confirmSendToAdmin = () => {
    Modal.confirm({
      title: 'Confirm Send',
      content: 'Are you sure you want to send the selected courses to the admin?',
      onOk: sendToAdmin, // Call sendToAdmin if the user confirms
      onCancel() {
        message.info('Send to admin cancelled');
      },
    });
  };

  return (
    <>      
      <div className="mb-4 mt-4 flex justify-between">
        <CustomSearch onSearch={handleSearch} placeholder="Search by course name" className="w-1/5" />
        <FilterStatus
          onStatusChange={handleStatusChange}
          currentStatus={statusFilter}
        />
        <div className="flex justify-end gap-2">
          <CreateCourseButton onCourseCreated={handleCourseCreated} />
          <Button onClick={confirmSendToAdmin} className="bg-gradient-tone text-white hover:opacity-90">
            Send To Admin
          </Button>
        </div>
      </div>
      <div className="mb-2">
        <span>{selectedRowKeys.length} course(s) selected</span>
      </div>
      <Table 
        rowSelection={{
          ...rowSelection,
          selectedRowKeys,
          columnTitle: (
            <div className="animate-pulse">
              <input
                type="checkbox"
                className="transition-all duration-300 ease-in-out transform hover:scale-110"
              />
            </div>
          )
        }}
        columns={columns} 
        dataSource={courses} 
        rowKey={(record) => record._id} 
        pagination={false}
        rowClassName={rowClassName}
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
      <Modal title="Confirm" open={isModalVisible} onOk={handleOk} onCancel={handleCancel} okText="Yes" cancelText="No" okButtonProps={{ className: "bg-gradient-tone" }}>
        <p>Are you sure you want to send the selected courses to admin? This action cannot be undone.</p>
      </Modal>
      {courseDetails && (
        <EditButton
          data={courseDetails}
          onEditSuccess={handleCourseCreated}
        />
      )}
    </>
  );
};

export default DisplayCourse;
