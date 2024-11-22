import React, { useEffect, useState } from "react";
import { moneyFormat, formatDate } from "../../../utils/helper";
import { courseStatusColor } from "../../../utils/courseStatus";
import { message, Table, Modal, Input, Button, Select } from "antd";
import {  CarryOutOutlined, ContainerOutlined, EyeOutlined } from "@ant-design/icons";
import { GetCourseParams } from "../../../models/api/request/course/course.request.model";
import { CourseService } from "../../../services/course/course.service";
import { LessonService } from "../../../services/lesson/lesson.service";
import { Lesson } from "../../../models/api/responsive/lesson/lesson.response.model";
import { SessionService } from "../../../services/session/session.service";
import { StatusType } from "../../../app/enums";
import ModalCourseDetail from "./ModalCourseDetail";
import { GetCourseByIdResponse } from "../../../models/api/responsive/course/course.response.model";
import { TableRowSelection } from "antd/es/table/interface";
const { confirm } = Modal;
import LoadingAnimation from "../../../app/UI/LoadingAnimation";
const defaultParams = {
  pageInfo: {
    pageNum: 1,
    pageSize: 10
  }
};

const CoursesManagement: React.FC<{
  searchTerm: string;
  statusFilter: StatusType | "";
  activeKey: string;
  refreshKey: number;
}> = ({ searchTerm, statusFilter, activeKey, refreshKey }) => {
  const [coursesData, setCourses] = useState<any[]>([]);
  const [isRejectModalVisible, setIsRejectModalVisible] = useState(false);
  const [rejectComment, setRejectComment] = useState("");
  const [selectedCourseId, setSelectedCourseId] = useState<string>("");
  const [isLessonModalVisible, setIsLessonModalVisible] = useState(false);
  const [lessons, setLessons] = useState<Lesson[]>([]);
  const [isSessionModalVisible, setIsSessionModalVisible] = useState(false);
  const [sessions, setSessions] = useState<any[]>([]);
  const [pageInfo, setPageInfo] = useState<any>({});
  const [isCourseDetailModalVisible, setIsCourseDetailModalVisible] = useState(false);
  const [selectedCourseDetail, setSelectedCourseDetail] = useState<GetCourseByIdResponse | null>(null);
  const [selectedRowKeys, setSelectedRowKeysState] = useState<number[]>([]);
  const [isStatusModalVisible, setIsStatusModalVisible] = useState(false);
  const fetchCourses = async (pageNum: number = defaultParams.pageInfo.pageNum, pageSize: number = defaultParams.pageInfo.pageSize) => {
    try {
      const params: GetCourseParams = {
        searchCondition: {
          keyword: searchTerm,
          category_id: "",
          status: statusFilter,
          is_delete: false
        },
        pageInfo: { pageNum, pageSize },
      };
      const response = await CourseService.getCourse(params);
      setCourses(response.data.data.pageData);
      setPageInfo(response.data.data.pageInfo);
    } catch (error) {
      message.error("Failed to fetch courses");
    }
  };

  useEffect(() => {
    fetchCourses();
    setSelectedRowKeysState([]); // Reset row selection when tab changes
  }, [searchTerm, statusFilter, refreshKey, activeKey]);

  const handleChangeStatus = async (id: string, newStatus: StatusType, comment: string = "") => {
    try {
      await CourseService.changeStatusCourse({ course_id: id, new_status: newStatus, comment });
      const updatedCourses = coursesData.map((course) => {
        if (course._id === id) {
          return { ...course, status: newStatus };
        }
        return course;
      });
      setCourses(updatedCourses);
      setSelectedRowKeysState([]); // Clear all selected checkboxes
      message.success(`Course status changed to ${newStatus} successfully`);
      setRejectComment("");
    } catch (error) {
      message.error("Failed to change course status");
    }
  };

  const showRejectModal = (id: string) => {
    setSelectedCourseId(id);
    setIsRejectModalVisible(true);
  };

  const showCourseDetailModal = async (courseId: string) => {
    try {
      const response = await CourseService.getCourseById(courseId);
      setSelectedCourseDetail(response.data.data);
      setIsCourseDetailModalVisible(true);
    } catch (error) {
      message.error("Failed to fetch course details");
    }
  };

  const handleRejectOk = () => {
    confirm({
      title: "Are you sure you want to reject this course?",
      onOk: () => {
        handleChangeStatus(selectedCourseId, StatusType.REJECT, rejectComment);
        setIsRejectModalVisible(false);
      },
      onCancel: () => {
        setIsRejectModalVisible(false);
        setRejectComment("");
      },
      okText: "Yes",
      cancelText: "No"
    });
  };

  const showLessonModal = async (courseId: string) => {
    try {
      const response = await LessonService.getLesson({
        searchCondition: {
          keyword: "",
          course_id: courseId,
          is_delete: false,
          is_position_order: false
        },
        pageInfo: { pageNum: 1, pageSize: 10 }
      });
      if (response.data) {
        const lessonData = Array.isArray(response.data.data.pageData) ? response.data.data.pageData : [response.data.data.pageData];
        setLessons(lessonData as unknown as Lesson[]);
        setIsLessonModalVisible(true);
      }
    } catch (error) {
      message.error("Failed to fetch lessons");
    }
  };

  const showSessionModal = async (courseId: string) => {
    try {
      const response = await SessionService.getSession({
        searchCondition: {
          keyword: "",
          course_id: courseId,
          is_delete: false,
          is_position_order: false
        },
        pageInfo: { pageNum: 1, pageSize: 10 }
      });
      if (response.data) {
        const sessionData = Array.isArray(response.data.data.pageData) ? response.data.data.pageData : [response.data.data.pageData];
        setSessions(sessionData);
        setIsSessionModalVisible(true);
      }
    } catch (error) {
      message.error("Failed to fetch sessions");
    }
  };

  const rowSelection: TableRowSelection<any> = {
    type: "checkbox",
    selectedRowKeys,
    onChange: (selectedKeys: React.Key[]) => setSelectedRowKeysState(selectedKeys as number[]),
    getCheckboxProps: (record: any) => ({
      disabled: record.status !== StatusType.WAITING_APPROVE,
    }),
  };

  const columns = [
    {
      title: "ID",
      dataIndex: "id",
      key: "id",
      render: (_: string, __: any, index: number) => index + 1
    },
    {
      title: "Name Course",
      dataIndex: "name",
      key: "name"
    },
    {
      title: "Category",
      dataIndex: "category_name",
      key: "category_name",
    },
    {
      title: "Status",
      dataIndex: "status",
      key: "status",
      render: (status: StatusType) => <span className={`text-sm capitalize ${courseStatusColor[status]}`}>{status}</span>
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
      render: (discount: string) => `${discount}%`
    },
    {
      title: "Created At",
      dataIndex: "created_at",
      key: "created_at",
      render: (date: string) => formatDate(new Date(date))
    },
    {
      title: "Action",
      key: "action",
      render: (record: any) => {
        const viewDetailsButton = (
          <Button
            icon={<EyeOutlined />}
            onClick={() => showCourseDetailModal(record._id)}
            className="mr-2 bg-white text-blue-500 hover:opacity-80"
            title="View Details"
          />
        );

        const lessonAndSessionButtons = (
          <>
            {record.lesson_count > 0 && (
              <Button
                icon={<CarryOutOutlined />}
                onClick={() => showLessonModal(record._id)}
                className="mr-2 bg-white text-orange-500 hover:opacity-80"
                title="View Lessons"
              />
            )}
            {record.session_count > 0 && (
              <Button
                icon={<ContainerOutlined />}
                onClick={() => showSessionModal(record._id)}
                className="mr-2 bg-white text-yellow-500 hover:opacity-80"
                title="View Sessions"
              />
            )}
          </>
        );

        return (
          <div>
            {lessonAndSessionButtons}
            {viewDetailsButton}
           </div>
        );
      }
    }
  ];

  const filteredCourses = coursesData.filter((course) => {
    const validStatuses = [StatusType.WAITING_APPROVE, StatusType.APPROVE, StatusType.REJECT];
    const matchesSearchTerm = course.name.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatusFilter = statusFilter === "" || course.status === statusFilter;
    const isValidStatus = statusFilter === "" || validStatuses.includes(course.status);

    return matchesSearchTerm && matchesStatusFilter && isValidStatus;
  });

  if (filteredCourses && pageInfo.totalItems) {
    return (
      <>
      <div className="flex justify-end mb-4 gap-2 w-full">
        <Button
          onClick={() => setIsStatusModalVisible(true)}
          className="bg-gradient-tone text-white hover:opacity-90"
          disabled={selectedRowKeys.length === 0}
        >
          Change Status
        </Button>
        <Modal
          title="Change Course Status"
          open={isStatusModalVisible}
          onCancel={() => setIsStatusModalVisible(false)}
          footer={[
            <Button key="cancel" onClick={() => setIsStatusModalVisible(false)}>
              Cancel
            </Button>,
            <Button key="ok" type="primary" onClick={() => setIsStatusModalVisible(false)}>
              OK
            </Button>
          ]}
        >
          <Select
            defaultValue=""
            className="w-full text-sm"
            placeholder="Select status"
            onChange={(value) => {
              const courseId = String(selectedRowKeys[0]);
              if (value === "Approve") {
                handleChangeStatus(courseId, StatusType.APPROVE);
              } else if (value === "Reject") {
                showRejectModal(courseId);
              }
              setIsStatusModalVisible(false);
            }}
          >
            <Select.Option value="Approve">Approve</Select.Option>
            <Select.Option value="Reject">Reject</Select.Option>
          </Select>
        </Modal>
      </div>
      <Table
        rowSelection={rowSelection}
        columns={columns}
        dataSource={filteredCourses}
        rowKey="_id"
        pagination={{
          current: pageInfo.pageNum,
          pageSize: pageInfo.pageSize,
          total: pageInfo.totalItems,
          showTotal: (total, range) => `${range[0]}-${range[1]} of ${total} items`,
          onChange: (page, pageSize) => {
            fetchCourses(page, pageSize);
          },
          showSizeChanger: true,
          className: "bg-pagination",
          position: ["bottomLeft"]
        }}
      />
      <Modal title="Reject Course" open={isRejectModalVisible} onOk={handleRejectOk} onCancel={() => setIsRejectModalVisible(false)}>
        <p>Please provide a reason for rejecting this course:</p>
        <Input.TextArea value={rejectComment} onChange={(e) => setRejectComment(e.target.value)} rows={4} />
      </Modal>
      <Modal
        width={1000}
        title="View Lessons"
        open={isLessonModalVisible}
        onCancel={() => setIsLessonModalVisible(false)}
        footer={[
          <Button key="close" onClick={() => setIsLessonModalVisible(false)}>
            Close
          </Button>
        ]}
      >
        <Table
          columns={[
            { title: "Course Name", dataIndex: "course_name", key: "course_name" },
            { title: "Lesson Name", dataIndex: "name", key: "name" },
            { title: "Lesson Type", dataIndex: "lesson_type", key: "lesson_type" },
            { title: "Full Time", dataIndex: "full_time", key: "full_time" },
            { title: "Created At", dataIndex: "created_at", key: "created_at", render: (date: string) => formatDate(new Date(date)) }
          ]}
          dataSource={lessons}
          rowKey="_id"
          pagination={{
            pageSize: 10,
            showSizeChanger: true,
            showTotal: (total, range) => `${range[0]}-${range[1]} of ${total} lessons`,
            className: "bg-pagination",
            position: ["bottomLeft"]
          }}
        />
      </Modal>
      <Modal
        width={1000}
        title="View Sessions"
        open={isSessionModalVisible}
        onCancel={() => setIsSessionModalVisible(false)}
        footer={[
          <Button key="close" onClick={() => setIsSessionModalVisible(false)}>
            Close
          </Button>
        ]}
      >
        <Table
          columns={[
            { title: "Session Name", dataIndex: "name", key: "name" },
            { title: "Course Name", dataIndex: "course_name", key: "course_name" },
            { title: "Created At", dataIndex: "created_at", key: "created_at", render: (date: string) => formatDate(new Date(date)) }
          ]}
          dataSource={sessions}
          rowKey="_id"
          pagination={{
            pageSize: 10,
            showSizeChanger: true,
            showTotal: (total, range) => `${range[0]}-${range[1]} of ${total} sessions`,
            className: "bg-pagination",
            position: ["bottomLeft"]
          }}
        />
      </Modal>
      <ModalCourseDetail
        visible={isCourseDetailModalVisible}
        onClose={() => setIsCourseDetailModalVisible(false)}
        courseDetail={selectedCourseDetail}
      />
      </>
    );
  } else {
    return <LoadingAnimation />;
  }
};

export default CoursesManagement;
