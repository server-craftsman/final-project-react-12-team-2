import React, { useEffect, useState } from "react";
import { moneyFormat, formatDate } from "../../../utils/helper";
import { courseStatusColor } from "../../../utils/courseStatus";
import { message, Popconfirm, Table, Modal, Input, Button, Pagination } from "antd";
import { CheckOutlined, StopOutlined, CarryOutOutlined, ContainerOutlined, EyeOutlined } from "@ant-design/icons";
// import { Courses } from "../../../models/prototype/Course"; // Import the Course model
import { GetCourseParams } from "../../../models/api/request/course/course.request.model";
import { CourseService } from "../../../services/course/course.service";
import { LessonService } from "../../../services/lesson/lesson.service";
import { Lesson } from "../../../models/api/responsive/lesson/lesson.response.model";
import { SessionService } from "../../../services/session/session.service";
import { StatusType } from "../../../app/enums";
// import { GetCourseResponsePageData } from "../../../models/api/responsive/course/course.response.model";
import ModalCourseDetail from "./ModalCourseDetail"; // Adjust the path as necessary
import { GetCourseByIdResponse } from "../../../models/api/responsive/course/course.response.model";
const { confirm } = Modal;

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
  const [pageNum, setPageNum] = useState<number>(1);
  const [pageSize, setPageSize] = useState<number>(10);
  const [pageInfo, setPageInfo] = useState<any>({});
  const [isCourseDetailModalVisible, setIsCourseDetailModalVisible] = useState(false);
  const [selectedCourseDetail, setSelectedCourseDetail] = useState<GetCourseByIdResponse | null>(null);

  const fetchCourses = async () => {
    try {
      const params: GetCourseParams = {
        searchCondition: {
          keyword: searchTerm,
          category_id: "",
          status: statusFilter,
          is_delete: false
        },
        pageInfo: {
          pageNum,
          pageSize
        }
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
  }, [searchTerm, statusFilter, refreshKey, activeKey, pageNum, pageSize]);

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
        const commonButtons = (
          <div>
            <Button icon={<CarryOutOutlined />} onClick={() => showLessonModal(record._id)} className="mr-2 bg-white text-orange-500 hover:opacity-80" title="View Lessons" />
            <Button icon={<ContainerOutlined />} onClick={() => showSessionModal(record._id)} className="mr-2 bg-white text-yellow-500 hover:opacity-80" title="View Sessions" />
            <Button icon={<EyeOutlined />} onClick={() => showCourseDetailModal(record._id)} className="mr-2 bg-white text-blue-500 hover:opacity-80" title="View Details" />
          </div>
        );

        if (record.status === StatusType.WAITING_APPROVE) {
          return (
            <div>
              <Popconfirm title="Confirm the course?" description="Are you sure to confirm this course?" onConfirm={() => handleChangeStatus(record._id, StatusType.APPROVE)} okText="Yes" cancelText="No">
                <Button icon={<CheckOutlined />} className="mr-2 bg-white text-green-500 hover:opacity-80" title="Confirm" />
              </Popconfirm>
              <Button icon={<StopOutlined />} className="mr-2 bg-white text-red-500 hover:opacity-80" onClick={() => showRejectModal(record._id)} title="Reject" />
              {commonButtons}
            </div>
          );
        }

        return commonButtons;
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

  const paginatedCourses = filteredCourses.slice((pageNum - 1) * pageSize, pageNum * pageSize);
  console.log(paginatedCourses);
  return (
    <>
      <Table
        columns={columns}
        dataSource={coursesData}
        rowKey="_id"
        pagination={false}
      />
      <div className="mt-5 flex justify-start">
        <Pagination
          current={pageNum}
          pageSize={pageSize}
          total={pageInfo.totalItems}
          showTotal={(total, range) => `${range[0]}-${range[1]} of ${total} items`}
          onChange={(page, pageSize) => {
            setPageNum(page);
            setPageSize(pageSize);
          }}
          showSizeChanger
          className="bg-pagination"
        />
      </div>
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
        />
      </Modal>
      <ModalCourseDetail
        visible={isCourseDetailModalVisible}
        onClose={() => setIsCourseDetailModalVisible(false)}
        courseDetail={selectedCourseDetail}
      />
    </>
  );
};

export default CoursesManagement;
