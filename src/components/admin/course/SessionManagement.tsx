
import React, { useState } from "react";
import { Session } from "../../../models/Session";
import sessionsData from "../../../data/sessions.json";
import { Table } from "antd";
import { Course } from "../../../models/Course";
import courseData from '../../../data/courses.json';



const SessionManagement = React.memo(() => {
  const [session] = useState<Session[]>(sessionsData.sessions)
  const [coursesData] = useState<Course[]>(courseData.courses as unknown as Course[]);


  const getCoursesNameBySessionId = (session_id: string) => {
    const course = coursesData.find((course) => course.id === session_id);
    return course ? course.name : "Unknown Course";
  }
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
      <Table columns={columns} dataSource={session} rowKey="id" />
    </div>
  )
})

export default SessionManagement
