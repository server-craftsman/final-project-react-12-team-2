import React, { useState } from "react";
import { Session } from "../../../models/Session";
import sessionsData from "../../../data/sessions.json";
import { Table } from "antd";
import { Course } from "../../../models/Course";
import courseData from "../../../data/courses.json";
import { formatDate } from "../../../utils/helper";

interface SessionManagementProps {
  searchTerm: string;
}

const SessionManagement: React.FC<SessionManagementProps> = ({ searchTerm }) => {
  const [sessionData] = useState<Session[]>(sessionsData.sessions);
  const [coursesData] = useState<Course[]>(
    courseData.courses as unknown as Course[],
  );

  const getCoursesNameBySessionId = (session_id: string) => {
    const course = coursesData.find((course) => course.id === session_id);
    return course ? course.name : "Unknown Course";
  };

  const columns = [
    {
      title: "Name",
      dataIndex: "name",
      key: "name",
    },
    {
      title: "Course Name",
      dataIndex: "course_id",
      key: "course_id",
      render: (courseId: string) => getCoursesNameBySessionId(courseId),
    },
    {
      title: "Created At",
      dataIndex: "created_at",
      key: "created_at",
      render: (date: string) => formatDate(new Date(date)),
    },
  ];

  const filteredSessions = sessionData.filter(session =>
    session.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    getCoursesNameBySessionId(session.course_id).toLowerCase().includes(searchTerm.toLowerCase())
  );

  return <Table columns={columns} dataSource={filteredSessions} rowKey="id" />;
};

export default SessionManagement;
