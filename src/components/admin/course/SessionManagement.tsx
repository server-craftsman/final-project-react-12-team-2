
import React, { useState } from "react";
import { Session } from "../../../models/Session";
import sessionsData from "../../../data/sessions.json";
import { Input, Table } from "antd";
import { Course } from "../../../models/Course";
import courseData from '../../../data/courses.json';



const SessionManagement = React.memo(() => {
  const [sessionData] = useState<Session[]>(sessionsData.sessions)
  const [coursesData] = useState<Course[]>(courseData.courses as unknown as Course[]);
  const [searchTerm, setSearchTerm] = useState<string>("");

  const getCoursesNameBySessionId = (session_id: string) => {
    const course = coursesData.find((course) => course.id === session_id);
    return course ? course.name : "Unknown Course";
  }

  const handleSearchChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(event.target.value);
  }

  const filteredSession = sessionData.filter((session) => (
    session.name.toLowerCase().includes(searchTerm.toLowerCase())
  ))


  const columns = [
    {
      title: 'Name',
      dataIndex: 'name',
      key: 'name',


    },
    {
      title: 'Course Name',
      dataIndex: 'course_id',
      key: 'course_id',
      render: (courseId: string) => getCoursesNameBySessionId(courseId),
    },
    {
      title: 'Created At',
      dataIndex: 'created_at',
      key: 'created_at',
    }
  ]
  return (
    <div>
      <Input.Search
        placeholder="Search session name"
        allowClear
        value={searchTerm}
        onChange={handleSearchChange}
        style={{ width: 300, marginBottom: 16 }}
      />
      <Table columns={columns} dataSource={filteredSession} rowKey="id" />
    </div>
  )
})

export default SessionManagement
