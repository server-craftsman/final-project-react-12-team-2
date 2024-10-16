import React from "react";
import { Table } from "antd";
import { CourseStatusEnum, Course } from "../../../models/Course";
import { courseStatusColor } from "../../../utils/courseStatus";

const CoursesLog: React.FC<{
  data: Course[];
}> = ({ data }) => {
  const columns = [
    {
      title: "Course Name",
      dataIndex: "name",
      key: "name",
    },
    {
      title: "Old Status",
      dataIndex: "oldStatus",
      key: "oldStatus",
      render: (text: string) => (
        <span className={courseStatusColor(text as CourseStatusEnum)}>
          {text}
        </span>
      ),
    },
    {
      title: "New Status",
      dataIndex: "newStatus",
      key: "newStatus",
      render: (text: string) => (
        <span className={courseStatusColor(text as CourseStatusEnum)}>
          {text}
        </span>
      ),
    },
    {
      title: "Comment",
      dataIndex: "comment",
      key: "comment",
    },
  ];

  return <Table columns={columns} dataSource={data} />;
};

export default CoursesLog;
