import React, { useState } from "react";
import { Lesson } from "../../../models/Lesson";
import lessonsData from "../../../data/lessons.json";
import { Table } from "antd";
import courseData from "../../../data/courses.json";
import { Course } from "../../../models/Course";
import { formatDate } from "../../../utils/helper";

interface LessonManagementProps {
  searchTerm: string;
}

const LessonManagement: React.FC<LessonManagementProps> = ({ searchTerm }) => {
  const [lessons] = useState<Lesson[]>(
    lessonsData.lessons as unknown as Lesson[],
  );
  const [coursesData] = useState<Course[]>(
    courseData.courses as unknown as Course[],
  );

  const getCoursesNameBySessionId = (session_id: string) => {
    const course = coursesData.find((course) => course.id === session_id);
    return course ? course.name : "Unknown Course";
  };

  const columns = [
    {
      title: "Lesson Name",
      dataIndex: "name",
      key: "name",
    },
    {
      title: "Course Name",
      dataIndex: "course_id",
      key: "course_id",
      render: (course_id: string) => getCoursesNameBySessionId(course_id),
    },
    {
      title: "Type",
      dataIndex: "lesson_type",
      key: "lesson_type",
    },
    {
      title: "Full Time",
      dataIndex: "full_time",
      key: "full_time",
    },
    {
      title: "Created At",
      dataIndex: "created_at",
      key: "created_at",
      render: (date: string) => formatDate(new Date(date)),
    },
    {
      title: "Image",
      dataIndex: "image_url",
      key: "image_url",
      render: (image_url: string) => (
        <img src={image_url} alt="lesson" style={{ width: 50, height: 50 }} />
      ),
    },
  ];

  const filteredLessons = lessons.filter(lesson =>
    lesson.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    getCoursesNameBySessionId(lesson.course_id).toLowerCase().includes(searchTerm.toLowerCase())
  );

  return <Table columns={columns} dataSource={filteredLessons} rowKey="id" />;
};

export default LessonManagement;
