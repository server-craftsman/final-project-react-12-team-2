import Table, { ColumnsType } from "antd/es/table";
import { CheckOutlined, HistoryOutlined, FormOutlined, SendOutlined } from "@ant-design/icons";
import { formatDate, moneyFormat } from "../../../../utils/helper";
import { CourseStatusBadge } from "../../../../utils/courseStatus";
import { StatusType } from "../../../../app/enums";
import { useEffect, useState, useCallback } from "react";
import { Button, message, Modal, Pagination, Form, Input } from "antd";
import CustomSearch from "../../../generic/search/CustomSearch";
import EditButton from "./EditButton";
import DeleteButton from "./DeleteButton";
import CreateCourseButton from "./CreateButton";
import FilterStatus from "./FilterStatus";
// import useCourseCache from "../../../../hooks/useCourseCache"; //api
import useCategoryCache from "../../../../hooks/useCategoryCache";
import { GetCourseParams } from "../../../../models/api/request/course/course.request.model";
import { GetCourseResponsePageData, GetCourseResponse, GetCourseByIdResponse } from "../../../../models/api/responsive/course/course.response.model";
import { CourseService } from "../../../../services/course/course.service";
import _ from "lodash";

const DisplayCourse = ({ searchTerm, statusFilter, onSearch, onStatusChange, refreshKey }: { searchTerm: string; statusFilter: StatusType; onSearch: (value: string) => void; onStatusChange: (status: StatusType | "") => void; refreshKey: number }) => {
  const [pageNum, setPageNum] = useState<number>(1);
  const [pageSize, setPageSize] = useState<number>(10);
  const [selectedRowKeys, setSelectedRowKeys] = useState<number[]>([]);
  const [selectedCourse, setSelectedCourse] = useState<number[]>([]);
  const [isModalVisible, setIsModalVisible] = useState(false);
  // const [courseDetails, setCourseDetails] = useState<any>(null);
  // const [refreshKey, setRefreshKey] = useState<number>(0);
  // const [comment, setComment] = useState<string>("");

  const getCourseData = useCallback(() => {
    const useCourseCache = (searchTerm: string, statusFilter: StatusType | "", pageNum: number, pageSize: number, refreshKey: number) => {
      const [courses, setCourses] = useState<GetCourseResponse["pageData"]>();
      const [totalItems, setTotalItems] = useState<number>(0);
      const [courseById, setCourseById] = useState<GetCourseByIdResponse>();
      const getCategoryName = useCategoryCache();

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

      const mapCourseData = async (course: any) => {
        let categoryName = "Unknown Category";
        if (course.category_name) {
          categoryName = await getCategoryName(course.category_name);
        } else {
          console.warn(`Course ID: ${course.id} does not have a category_id`);
        }
        return {
          ...course,
          category_name: categoryName,
          course_id: course.id ? String(course.id) : ""
        };
      };

      const fetchCourses = async () => {
        try {
          const response = await CourseService.getCourse(params);

          if (response.status === 200 && response.data) {
            const pageData = Array.isArray(response.data.data.pageData) ? response.data.data.pageData : [];

            const coursesTempData = await Promise.all(pageData.map(mapCourseData));

            setCourses(coursesTempData);
            setTotalItems(response.data.data.pageInfo.pageNum);
          }
        } catch (error) {
          console.error("Error fetching courses:", error);
          return null;
        }
      };

      //thực thi
      const fetchCourseById = async (id: string) => {
        try {
          const response = await CourseService.getCourseById(id);
          if (response.status === 200 && response.data) {
            setCourseById(response.data.data);
            return response.data.data;
          }
        } catch (error) {
          return null;
        }
      };

      useEffect(() => {
        fetchCourses();
      }, [searchTerm, statusFilter, pageNum, pageSize, refreshKey]); //debug

      return { courses, totalItems, courseById, fetchCourseById, fetchCourses, refreshKey };
    };

    return useCourseCache(searchTerm, statusFilter as StatusType | "", pageNum, pageSize, refreshKey);
  }, [searchTerm, statusFilter, pageNum, pageSize, refreshKey]);

  const { courses, totalItems } = getCourseData();

  // // Trigger API call when the active tab changes to "Course"
  // useEffect(() => {
  //   setRefreshKey((prevKey) => prevKey + 1); // Increment refreshKey to trigger data fetch
  // }, []);

  // Filter courses based on the statusFilter
  const filteredCourses = courses?.filter((course) => !statusFilter || course.status === statusFilter);

  const handleCourseCreated = () => {};

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
      message.success("Course approved and activated");
      handleCourseCreated();
    } catch (error) {
      message.error("Failed to approve course");
    }
  };

  const requestReview = async (courseId: string, comment: string) => {
    try {
      await CourseService.changeStatusCourse({
        course_id: courseId,
        new_status: StatusType.WAITING_APPROVE,
        comment: comment
      });
      message.success("Review requested");
      handleCourseCreated();
    } catch (error) {
      message.error("Failed to request review");
    }
  };

  const showRequestReviewModal = (courseId: string) => {
    let tempComment = ""; // Create temporary comment state

    Modal.confirm({
      title: "Request Course Review",
      width: 600,
      icon: <FormOutlined />,
      content: (
        <div className="p-6">
          <h3 className="mb-4 text-lg font-medium">Please provide details for your review request</h3>
          <Form layout="vertical">
            <Form.Item label="Comments" required tooltip="Please explain why you are requesting a review">
              <Input.TextArea onChange={(e) => (tempComment = e.target.value)} placeholder="Enter your comments here..." rows={4} className="w-full" showCount maxLength={500} />
            </Form.Item>
          </Form>
        </div>
      ),
      okText: "Submit Request",
      cancelText: "Cancel",
      okButtonProps: {
        type: "primary",
        icon: <SendOutlined />
      },
      onOk: () => {
        if (!tempComment.trim()) {
          message.error("Please enter comments before submitting");
          return Promise.reject();
        }
        return requestReview(courseId, tempComment);
      },
      onCancel: () => {
        tempComment = "";
      }
    });
  };

  // const handleCourseSelect = (courseId: string) => {
  //   fetchCourseDetails(courseId);
  //   setIsModalVisible(true);
  // };

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
      render: (_, record) => {
        const { status, _id } = record;
        return (
          <>
            {status === StatusType.APPROVE && <Button icon={<CheckOutlined />} onClick={() => handleApprove(_id)} className="bg-gradient-tone mr-2 text-white hover:opacity-90" />}
            {status === StatusType.REJECT && <Button icon={<HistoryOutlined />} onClick={() => showRequestReviewModal(_id)} className="bg-gradient-tone mr-2 text-white hover:opacity-90" />}
            <EditButton data={record} onEditSuccess={handleCourseCreated} fetchCourseDetails={fetchCourseDetails} />
            <DeleteButton courseId={record._id} onDeleteSuccess={handleCourseCreated} />
          </>
        );
      }
    }
  ];

  const rowClassName = (record: GetCourseResponsePageData) => {
    return selectedRowKeys.includes(Number(record._id)) ? "bg-white" : "bg-gray-50";
  };

  const handleOk = useCallback(async () => {
    try {
      const validCourses = courses?.filter((course) => selectedCourse.includes(Number(course._id)) && (course.status === StatusType.NEW || course.status === StatusType.REJECT));

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
    } catch (error) {
      message.error("Failed to send courses to admin");
    }
  }, [courses, selectedCourse, setIsModalVisible, setSelectedRowKeys, refreshKey]); //debug

  const handleCancel = () => {
    setIsModalVisible(false);
  };

  const handleStatusChange = (status: StatusType | "") => {
    setPageNum(1);
    onStatusChange(status);
  };

  const handleRowSelectionChange = (selectedKeys: React.Key[]) => {
    // Ensure unique selection using lodash
    const uniqueKeys = _.uniq(selectedKeys as number[]);
    setSelectedRowKeys(uniqueKeys);
  };

  const sendToAdmin = useCallback(async () => {
    try {
      // console.log("Selected Row Keys:", selectedRowKeys); // Debugging log

      // Filter courses based on selected row keys
      const validCourses = courses?.filter(
        (course) =>
          selectedRowKeys.includes(course._id as unknown as number) && // Ensure course._id is a string
          (course.status === StatusType.NEW || course.status === StatusType.REJECT)
      );

      //test debug
      // console.log("Valid Courses:", validCourses); // Debugging log

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
      message.success("Successfully sent courses to admin");
    } catch (error) {
      message.error("Failed to send courses to admin");
    }
  }, [courses, selectedRowKeys, handleCourseCreated]);

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
  console.log("Valid Status Filter:", validStatusFilter);

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
      <div className="mb-2">
        <span>{selectedRowKeys.length} course(s) selected</span>
      </div>
      <Table
        rowSelection={{
          type: "checkbox",
          selectedRowKeys,
          onChange: handleRowSelectionChange,
          selections: [Table.SELECTION_ALL, Table.SELECTION_INVERT, Table.SELECTION_NONE],
          getCheckboxProps: (record) => ({
            name: record._id,
            disabled: record.status !== StatusType.NEW && record.status !== StatusType.REJECT // Disable selection for other statuses
          })
        }}
        columns={columns}
        dataSource={filteredCourses} // Use filtered courses
        rowKey={(record) => record._id}
        pagination={false}
        rowClassName={rowClassName}
      />
      <div className="mt-5 flex justify-start">
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
      {/* {courseDetails && <EditButton data={courseDetails} onEditSuccess={handleCourseCreated} />} */}
    </>
  );
};

export default DisplayCourse;
