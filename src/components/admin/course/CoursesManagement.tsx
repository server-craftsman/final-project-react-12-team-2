import React, { useEffect, useState } from "react";
import { moneyFormat, formatDate } from "../../../utils/helper";
import { courseStatusColor } from "../../../utils/courseStatus";
import { message, Popconfirm, Table, Modal, Input, Button } from "antd";
import { CheckOutlined, StopOutlined, CarryOutOutlined, ContainerOutlined } from "@ant-design/icons";
import { Courses, CourseStatusEnum } from "../../../models/prototype/Course"; // Import the Course model
import { GetCourseParams } from "../../../models/api/request/course/course.request.model";
import { CourseService } from "../../../services/course/course.service";
import { LessonService } from "../../../services/lesson/lesson.service";
import { Lesson } from "../../../models/api/responsive/lesson/lesson.response.model";
import { SessionService } from "../../../services/session/session.service";
const { confirm } = Modal;

const CoursesManagement: React.FC<{
  searchTerm: string;
  statusFilter: CourseStatusEnum | "";
  activeKey: string;
}> = ({ searchTerm, statusFilter, activeKey }) => {
  const [coursesData, setCourses] = useState<Courses[]>([]);
  const [isRejectModalVisible, setIsRejectModalVisible] = useState(false);
  const [rejectComment, setRejectComment] = useState("");
  const [selectedCourseId, setSelectedCourseId] = useState<string>("");
  const [isLessonModalVisible, setIsLessonModalVisible] = useState(false);
  const [lessons, setLessons] = useState<Lesson[]>([]);
  const [isSessionModalVisible, setIsSessionModalVisible] = useState(false);
  const [sessions, setSessions] = useState<any[]>([]);

  useEffect(() => {
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
            pageNum: 1,
            pageSize: 10
          }
        };
        const response = await CourseService.getCourse(params);
        setCourses(response.data.data.pageData as unknown as Courses[]);
      } catch (error) {
        message.error("Failed to fetch courses");
      }
    };

    fetchCourses();
  }, [searchTerm, statusFilter, activeKey]);

  const handleChangeStatus = async (id: string, newStatus: CourseStatusEnum, comment: string = "") => {
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

  const handleRejectOk = () => {
    confirm({
      title: "Are you sure you want to reject this course?",
      onOk: () => {
        handleChangeStatus(selectedCourseId, CourseStatusEnum.reject, rejectComment);
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
        pageInfo: { pageNum: 1, pageSize: 100 }
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
        pageInfo: { pageNum: 1, pageSize: 100 }
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
      render: (_: string, __: Courses, index: number) => index + 1
    },
    {
      title: "Name Course",
      dataIndex: "name",
      key: "name"
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
      title: "Status",
      dataIndex: "status",
      key: "status",
      render: (status: CourseStatusEnum) => <span className={`text-sm capitalize ${courseStatusColor[status]}`}>{status}</span>
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
      render: (record: Courses) =>
        record.status === CourseStatusEnum.waiting_approve ? (
          <div>
            <Popconfirm
              title="Confirm the course?"
              description="Are you sure to confirm this course?"
              onConfirm={() => handleChangeStatus(record._id, CourseStatusEnum.approve)}
              okText="Yes"
              cancelText="No"
            >
              <Button
                icon={<CheckOutlined />}
                className="bg-white text-green-500 mr-2 hover:opacity-80"
                title="Confirm"
              />
            </Popconfirm>

            <Button
              icon={<StopOutlined />}
              className="bg-white text-red-500 mr-2 hover:opacity-80"
              onClick={() => showRejectModal(record._id)}
              title="Reject"
            />
            <Button 
            icon ={<CarryOutOutlined />}
            onClick={() => showLessonModal(record._id)}
            className="bg-white text-orange-500 mr-2 hover:opacity-80"
            title="View Lessons"
            />
            <Button
              icon={<ContainerOutlined />}
              onClick={() => showSessionModal(record._id)}
              className="bg-white text-yellow-500 mr-2 hover:opacity-80"
              title="View Sessions"
            />
          </div>
        ) : (
          <div>
             <Button 
            icon ={<CarryOutOutlined />}
            onClick={() => showLessonModal(record._id)}
            className="bg-white text-orange-500 mr-2 hover:opacity-80"
            title="View Lessons"
            />
            <Button
              icon={<ContainerOutlined />}
              onClick={() => showSessionModal(record._id)}
              className="bg-white text-yellow-500 mr-2 hover:opacity-80"
              title="View Sessions"
            />
          </div>
        )
    }
  ];

  const filteredCourses = coursesData.filter((course) => {
    const validStatuses = [CourseStatusEnum.waiting_approve, CourseStatusEnum.approve, CourseStatusEnum.reject];
    return course.name.toLowerCase().includes(searchTerm.toLowerCase()) && (statusFilter === "" || course.status === statusFilter) && validStatuses.includes(course.status);
  });

  return (
    <>
      <Table columns={columns} dataSource={filteredCourses} rowKey="_id" />
      <Modal
        title="Reject Course"
        open={isRejectModalVisible}
        onOk={handleRejectOk}
        onCancel={() => setIsRejectModalVisible(false)}
      >
        <p>Please provide a reason for rejecting this course:</p>
        <Input.TextArea
          value={rejectComment}
          onChange={(e) => setRejectComment(e.target.value)}
          rows={4}
        />
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
    </>
  );
};

export default CoursesManagement;
