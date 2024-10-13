import { Tabs } from "antd";
import CoursesManagement from "../../../components/admin/course/CoursesManagement";
import LessonManagement from "../../../components/admin/course/LessonManagement";
import SessionManagement from "../../../components/admin/course/SessionManagement";

const ManageCourses = () => {
  const items = [
    {
      key: "1",
      label: "Courses",
      children: <CoursesManagement />,
    },
    {
      key: "2",
      label: "Sessions",
      children: <SessionManagement />,
    },
    {
      key: "3",
      label: "Lessons",
      children: <LessonManagement />,
    },
  ];

  return (
    <div className="w-full flex-col gap-4">
      <Tabs defaultActiveKey="1" items={items} />
    </div>
  );
};

export default ManageCourses;
