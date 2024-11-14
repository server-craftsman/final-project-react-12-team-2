import Table, { ColumnsType } from "antd/es/table";
// import { FormOutlined, SendOutlined } from "@ant-design/icons";
import { formatDate, moneyFormat } from "../../../../utils/helper";
import { CourseStatusBadge } from "../../../../utils/courseStatus";
import { StatusType } from "../../../../app/enums";
import { useEffect, useState, useCallback } from "react";
import { Button, message, Modal, Switch } from "antd";
import { EyeOutlined } from "@ant-design/icons";
import CustomSearch from "../../../generic/search/CustomSearch";
import EditButton from "./EditButton";
import DeleteButton from "./DeleteButton";
import CreateCourseButton from "./CreateButton";
import FilterStatus from "./FilterStatus";
// import useCourseCache from "../../../../hooks/useCourseCache"; //api
// import useCategoryCache from "../../../../hooks/useCategoryCache";
import { GetCourseParams } from "../../../../models/api/request/course/course.request.model";
import { GetCourseResponse } from "../../../../models/api/responsive/course/course.response.model";
import { CourseService } from "../../../../services/course/course.service";
import DetailModal from './DetailModal';
// import _ from "lodash";

const DisplayCourse = ({ searchTerm, statusFilter, onSearch, onStatusChange, refreshKey }: { searchTerm: string; statusFilter: StatusType; onSearch: (value: string) => void; onStatusChange: (status: StatusType | "") => void; refreshKey: number }) => {
  const [pageNum, setPageNum] = useState<number>(1);
  const [pageSize, setPageSize] = useState<number>(10);
  const [courses, setCourses] = useState<GetCourseResponse["pageData"]>();
  const [pageInfo, setPageInfo] = useState<any>({});
  const [dataRefreshKey, setDataRefreshKey] = useState<number>(0);

  const fetchCourses = useCallback(async () => {
    const params: GetCourseParams = {
      searchCondition: {
        keyword: searchTerm,
        category_id: "",
        status: statusFilter || "",
        is_delete: false
      },
      pageInfo: {
        pageNum,
        pageSize
      }
    };

    try {
      const response = await CourseService.getCourse(params);

      if (response.status === 200 && response.data) {
        setCourses(response.data.data.pageData as GetCourseResponse["pageData"]);
        setPageInfo(response.data.data.pageInfo);
      }
    } catch (error) {
      console.error("Error fetching courses:", error);
    }
  }, [searchTerm, statusFilter, pageNum, pageSize]);

  useEffect(() => {
    fetchCourses();
  }, [searchTerm, statusFilter, dataRefreshKey, fetchCourses]);

  const [selectedRowKeys, setSelectedRowKeys] = useState<number[]>([]);
  const [selectedCourse, setSelectedCourse] = useState<number[]>([]);
  const [isModalVisible, setIsModalVisible] = useState(false);
  // const [courseDetails, setCourseDetails] = useState<any>(null);
  // const [refreshKey, setRefreshKey] = useState<number>(0);
  // const [comment, setComment] = useState<string>("");

  // Filter courses based on the statusFilter
  const filteredCourses = courses?.filter((course) => !statusFilter || course.status === statusFilter);

  const handleCourseCreated = useCallback(() => {
    setPageNum(1);
    setDataRefreshKey((prevKey) => prevKey + 1); //debug by new useState refreshKey
  }, [refreshKey]);

  useEffect(() => {
    setPageNum(1);
  }, [statusFilter]);

  useEffect(() => {
    setSelectedCourse(selectedRowKeys as unknown as any);
  }, [selectedRowKeys, setSelectedCourse]);

  const handleSearch = (searchText: string) => {
    setPageNum(1);
    onSearch(searchText);
    setDataRefreshKey((prevKey) => prevKey + 1);
  };

  const fetchCourseDetails = async (courseId: string) => {
    try {
      const details = await CourseService.getCourseById(courseId);
      if (details && details.data && details.data.data) {
        return details.data.data; // Return the fetched course details
      } else {
        message.error("Course details not found");
        return null;
      }
    } catch (error) {
      message.error("Failed to fetch course details");
      return null;
    }
  };

  const handleApprove = async (courseId: string) => {
    try {
      await CourseService.changeStatusCourse({
        course_id: courseId,
        new_status: StatusType.ACTIVE,
        comment: ""
      });
      // window.location.reload();
      await handleCourseCreated();
      setTimeout(() => {
        message.success("Course approved and activated");
      }, 1000);
    } catch (error) {
      message.error("Failed to approve course");
    }
  };

  const handleInactive = async (courseId: string) => {
    try {
      await CourseService.changeStatusCourse({
        course_id: courseId,
        new_status: StatusType.INACTIVE,
        comment: ""
      });
      await handleCourseCreated();
      setTimeout(() => {
        message.success("Course inactivated");
      }, 1000);
    } catch (error) {
      message.error("Failed to inactivate course");
    }
  };

  const [selectedCourseId, setSelectedCourseId] = useState<string | null>(null);
  const [isDetailModalVisible, setIsDetailModalVisible] = useState(false);

  const showCourseDetails = (courseId: string) => {
    setSelectedCourseId(courseId);
    setIsDetailModalVisible(true);
  };

  const closeDetailModal = () => {
    setIsDetailModalVisible(false);
    setSelectedCourseId(null);
  };

  const columns: ColumnsType<any> = [
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
      title: "Change Status",
      key: "change_status",
      dataIndex: "change_status",
      render: (_, record) => {
        const { status, _id } = record;
        return (
          <>
            {(status === StatusType.ACTIVE || status === StatusType.INACTIVE || status === StatusType.APPROVE) && (
              <>
                <Switch
                  checked={status === StatusType.ACTIVE}
                  onChange={(checked) => {
                    if (checked) {
                      handleApprove(_id);
                    } else {
                      handleInactive(_id);
                    }
                  }}
                  checkedChildren="Active"
                  unCheckedChildren={status === StatusType.APPROVE ? "Active" : "Inactive"}
                  className={`${status === StatusType.APPROVE ? "bg-blue-600" : "bg-gradient-tone"} mr-2 text-white hover:opacity-90`}
                />
              </>
            )}
          </>
        );
      }
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
          <div className="flex space-x-3">
            <EditButton data={record} onEditSuccess={handleCourseCreated} fetchCourseDetails={fetchCourseDetails} />
            <DeleteButton courseId={record._id} onDeleteSuccess={handleCourseCreated} />
            <Button onClick={() => showCourseDetails(record._id)} icon={<EyeOutlined />} className="bg-gradient-tone text-white hover:opacity-90" />
          </div>
        </>
      )
    }
  ];

  // const rowClassName = (record: any) => {
  //   return selectedRowKeys.includes(Number(record._id)) ? "bg-white" : "bg-gray-50";
  // };

  const handleOk = useCallback(async () => {
    try {
      const validCourses = courses?.filter((course) => selectedCourse.includes(Number(course._id)) && (course.status === StatusType.NEW || course.status === StatusType.REJECT) && (course.lesson_count ?? 0) > 0 && (course.session_count ?? 0) > 0);

      if (!validCourses?.length) {
        message.warning("No valid courses selected to send");
        return;
      }

      const updateStatus = async (courseChunk: typeof validCourses) => {
        return Promise.all(
          courseChunk.map((course) =>
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
      handleCourseCreated();
    } catch (error) {
      message.error("Failed to send courses to admin");
    }
  }, [courses, selectedCourse, setIsModalVisible, setSelectedRowKeys, handleCourseCreated]); //debug

  const handleCancel = () => {
    setIsModalVisible(false);
  };

  const handleStatusChange = (status: StatusType | "") => {
    setPageNum(1);
    onStatusChange(status);
    setDataRefreshKey((prevKey) => prevKey + 1);
  };

  const sendToAdmin = useCallback(async () => {
    try {
      // Filter courses based on selected row keys
      const validCourses = courses?.filter((course) => selectedRowKeys.includes(course._id as unknown as number) && (course.status === StatusType.NEW || course.status === StatusType.REJECT) && (course.lesson_count ?? 0) > 0 && (course.session_count ?? 0) > 0);

      if (!validCourses?.length) {
        message.warning("No valid courses selected to send");
        return;
      }

      const updateStatus = async (courseChunk: typeof validCourses) => {
        return Promise.all(
          courseChunk.map((course) =>
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
      setSelectedRowKeys([]); // Clear all selected checkboxes
      message.success("Successfully sent courses to admin");
    } catch (error) {
      message.error("Failed to send courses to admin");
    }
  }, [courses, selectedRowKeys, handleCourseCreated, setSelectedRowKeys]);

  const confirmSendToAdmin = () => {
    if (selectedRowKeys.length === 0) {
      message.warning("Please select at least one course to send to admin.");
      return;
    }

    Modal.confirm({
      title: "Confirm Send",
      content: "Are you sure you want to send the selected courses to the admin?",
      onOk: sendToAdmin, // Chỉ gọi hàm sendToAdmin khi người dùng xác nhận
      onCancel() {
        message.info("Send to admin cancelled");
      }
    });
  };

  // Ensure that the statusFilter is a valid StatusType or an empty string
  const validStatusFilter = Object.values(StatusType).includes(statusFilter) ? statusFilter : "";

  // const handlePageChange = (page: number, pageSize?: number) => {
  //   setPageNum(page);
  //   if (pageSize) setPageSize(pageSize);
  // };

  return (
    <>
      <div className="mb-4 mt-4 flex justify-between">
        <CustomSearch onSearch={handleSearch} placeholder="Search by course name" className="w-1/5" />
        <FilterStatus onStatusChange={handleStatusChange} currentStatus={validStatusFilter} />
        <div className="flex justify-end gap-2">
          <CreateCourseButton onCourseCreated={handleCourseCreated} />
          <Button
            onClick={confirmSendToAdmin}
            className="bg-gradient-tone text-white hover:opacity-90"
            disabled={selectedRowKeys.length === 0} // Disable button if no checkboxes are selected
          >
            Send To Admin
          </Button>
        </div>
      </div>
      {/* <div className="mb-2">
        <span>{selectedRowKeys.length} course(s) selected</span>
      </div> */}
      <Table
        rowSelection={{
          type: "radio",
          selectedRowKeys,
          onChange: (selectedKeys) => setSelectedRowKeys(selectedKeys as number[]),
          getCheckboxProps: (record) => ({
            name: record._id,
            disabled: (record.status !== StatusType.NEW && record.status !== StatusType.REJECT) || (record.lesson_count ?? 0) <= 0 || (record.session_count ?? 0) <= 0 // Disable selection for other statuses or if lessons or sessions are <= 0
          })
        }}
        columns={columns}
        dataSource={filteredCourses} // Use filtered courses
        rowKey={(record) => record._id}
        pagination={{
          current: pageNum,
          pageSize: pageSize,
          total: pageInfo.totalItems,
          showTotal: (total, range) => `${range[0]}-${range[1]} of ${total} items`,
          onChange: (page, pageSize) => {
            setPageNum(page);
            if (pageSize) setPageSize(pageSize);
          },
          showSizeChanger: true,
          className: "bg-pagination mr-10",
          position: ["bottomLeft"]
        }}
      />
      <Modal title="Confirm" open={isModalVisible} onOk={handleOk} onCancel={handleCancel} okText="Yes" cancelText="No" okButtonProps={{ className: "bg-gradient-tone" }}>
        <p>Are you sure you want to send the selected courses to admin? This action cannot be undone.</p>
      </Modal>
      <DetailModal
        courseId={selectedCourseId}
        isVisible={isDetailModalVisible}
        onClose={closeDetailModal}
      />
    </>
  );
};

export default DisplayCourse;
