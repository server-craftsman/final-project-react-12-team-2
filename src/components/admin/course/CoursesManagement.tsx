import React, { useState } from "react";
import { getOrderStatus, moneyFormat } from "../../../utils/helper";
import { Button, Input, message, Popconfirm, Table } from "antd";
import courseData from "../../../data/courses.json";
import { Course, CourseStatusEnum } from "../../../models/Course"; // Import the Course model

const CoursesManagement = React.memo(() => {
  const [coursesData, setCourses] = useState<Course[]>(
    courseData.courses as unknown as Course[],
  );
  const [searchTerm, setSearchTerm] = useState<string>("");

  const handleSearchChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(event.target.value);
  };

  const filteredCourses = coursesData.filter((course) =>
    course.name.toLowerCase().includes(searchTerm.toLowerCase()),
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
      title: "Category",
      dataIndex: "category_id",
      key: "category_id",
    },
    {
      title: "User ID",
      dataIndex: "user_id",
      key: "user_id",
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
          style={{
            color:
              status === CourseStatusEnum.reject
                ? "red"
                : status === CourseStatusEnum.approve
                  ? "green"
                  : "black",
          }}
        >
          {status === CourseStatusEnum.reject
            ? "Reject"
            : getOrderStatus(status)}
        </span>
      ),
    },
    {
      title: "Created At",
      dataIndex: "created_at",
      key: "created_at",
    },
    {
      title: "Action",
      key: "action",
      render: (record: Course) => (
        <div>
          <Button
            type="primary"
            onClick={() => handleApprove(record.id)}
            style={{ marginRight: 8 }}
          >
            Approve
          </Button>
          <Popconfirm
            title="Block the course?"
            description="Are you sure to block this course?"
            onConfirm={() => handleBlock(record.id)}
            okText="Yes"
            cancelText="No"
          >
            <Button danger>Block</Button>
          </Popconfirm>
        </div>
      ),
    },
  ];

  return (
    <div>
      <Input.Search
        placeholder="Search course name"
        allowClear
        value={searchTerm}
        onChange={handleSearchChange}
        style={{ width: 300, marginBottom: 16 }}
      />
      <Table columns={columns} dataSource={filteredCourses} rowKey="id" />
    </div>
  );
});

export default CoursesManagement;
