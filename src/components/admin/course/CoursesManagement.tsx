import React, { useEffect, useState } from "react";
import { moneyFormat, formatDate } from "../../../utils/helper";
import { courseStatusColor } from "../../../utils/courseStatus";
import { message, Popconfirm, Table, Modal, Input } from "antd";
import { CheckOutlined, StopOutlined } from "@ant-design/icons";
import { Courses, CourseStatusEnum } from "../../../models/prototype/Course"; // Import the Course model
import { GetCourseParams } from "../../../models/api/request/course/course.request.model";
import { CourseService } from "../../../services/course/course.service";

const { confirm } = Modal;

const CoursesManagement: React.FC<{
  searchTerm: string;
  statusFilter: CourseStatusEnum | "";
}> = ({ searchTerm, statusFilter }) => {
  const [coursesData, setCourses] = useState<Courses[]>([]);
  const [isRejectModalVisible, setIsRejectModalVisible] = useState(false);
  const [rejectComment, setRejectComment] = useState("");
  const [selectedCourseId, setSelectedCourseId] = useState<string>("");

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
  }, [searchTerm, statusFilter]);

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
              <CheckOutlined style={{ color: "green", marginRight: 8, cursor: "pointer" }} />
            </Popconfirm>

            <StopOutlined
              style={{ color: "red", cursor: "pointer" }}
              onClick={() => showRejectModal(record._id)}
            />
          </div>
        ) : null
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
    </>
  );
};

export default CoursesManagement;
