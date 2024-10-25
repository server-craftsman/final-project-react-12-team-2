import React, { useState } from "react";
import { moneyFormat, formatDate } from "../../../utils/helper";
import { courseStatusColor } from "../../../utils/courseStatus";
import { message, Popconfirm, Table } from "antd";
import { CheckOutlined, StopOutlined } from "@ant-design/icons";
import courseData from "../../../data/courses.json";
import { Course, CourseStatusEnum } from "../../../models/prototype/Course"; // Import the Course model

const CoursesManagement: React.FC<{
  searchTerm: string;
  statusFilter: CourseStatusEnum | "";
}> = ({ searchTerm, statusFilter }) => {
  const [coursesData, setCourses] = useState<Course[]>(
    courseData.courses as unknown as Course[],
  );

  const handleApprove = (id: string) => {
    const updatedCourses = coursesData.map((course) => {
      if (course.id === id) {
        return { ...course, status: CourseStatusEnum.approve };
      }
      return course;
    });
    setCourses(updatedCourses);
    message.success("Course approved successfully");
  };

  const handleBlock = (id: string) => {
    const updatedCourses = coursesData.map((course) => {
      if (course.id === id) {
        return { ...course, status: CourseStatusEnum.reject };
      }
      return course;
    });
    setCourses(updatedCourses);
    message.error("Course has been blocked.");
  };

  const columns = [
    {
      title: "ID",
      dataIndex: "id",
      key: "id",
      render: (text: string) => `#${text}`,
    },
    {
      title: "Name Course",
      dataIndex: "name",
      key: "name",
    },
    {
      title: "Price",
      dataIndex: "price",
      key: "price",
      render: (money: number) => moneyFormat(money),
    },
    {
      title: "Discount",
      dataIndex: "discount",
      key: "discount",
      render: (discount: string) => `${discount}%`,
    },
    {
      title: "Status",
      dataIndex: "status",
      key: "status",
      render: (status: CourseStatusEnum) => (
        <span
          className="text-sm capitalize"
          style={{ color: courseStatusColor[status] }}
        >
          {status === CourseStatusEnum.reject ? "Reject" : status}
        </span>
      ),
    },
    {
      title: "Created At",
      dataIndex: "created_at",
      key: "created_at",
      render: (date: string) => formatDate(new Date(date)),
    },
    {
      title: "Action",
      key: "action",
      render: (record: Course) => (
        <div>
          <CheckOutlined
            style={{ color: "green", marginRight: 8, cursor: "pointer" }}
            onClick={() => handleApprove(record.id)}
          />
          <Popconfirm
            title="Block the course?"
            description="Are you sure to block this course?"
            onConfirm={() => handleBlock(record.id)}
            okText="Yes"
            cancelText="No"
          >
            <StopOutlined style={{ color: "red", cursor: "pointer" }} />
          </Popconfirm>
        </div>
      ),
    },
  ];

  const filteredCourses = coursesData.filter(
    (course) =>
      course.name.toLowerCase().includes(searchTerm.toLowerCase()) &&
      (statusFilter === "" || course.status === statusFilter),
  );

  return (
    <>
      <Table columns={columns} dataSource={filteredCourses} rowKey="id" />
    </>
  );
};

export default CoursesManagement;
