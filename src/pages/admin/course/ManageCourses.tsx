import { useState } from "react";
import { Tabs } from "antd";
import CoursesManagement from "../../../components/admin/course/CoursesManagement";
import LessonManagement from "../../../components/admin/course/LessonManagement";
import SessionManagement from "../../../components/admin/course/SessionManagement";
import CustomSearch from "../../../components/generic/search/CustomSearch";
import FilterStatus from "../../../components/admin/course/FilterStatus";
import { CourseStatusEnum } from "../../../models/prototype/Course";

const ManageCourses = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [activeKey, setActiveKey] = useState("1");
  const [statusFilter, setStatusFilter] = useState<CourseStatusEnum | "">("");
  const [tempStatusFilter, setTempStatusFilter] = useState<CourseStatusEnum | "">("");

  const items = [
    {
      key: "1",
      label: "Courses",
      children: <CoursesManagement searchTerm={searchTerm} statusFilter={statusFilter} activeKey={activeKey} />
    },
    {
      key: "2",
      label: "Sessions",
      children: <SessionManagement searchTerm={searchTerm} activeKey={activeKey} />
    },
    {
      key: "3",
      label: "Lessons",
      children: <LessonManagement searchTerm={searchTerm} activeKey={activeKey} />
    }
  ];

  const handleSearch = (value: string) => {
    setSearchTerm(value);
    setStatusFilter(tempStatusFilter);
  };

  const handleTabChange = (key: string) => {
    setActiveKey(key);
    setSearchTerm(""); // Reset searchTerm to empty string when changing tabs
  };

  const handleStatusChange = (status: CourseStatusEnum | "") => {
    setTempStatusFilter(status);
  };

  return (
    <div className="w-full flex-col gap-4">
      <div className="flex items-center justify-between">
        <CustomSearch
          onSearch={handleSearch}
          placeholder={`Search ${activeKey === "1" ? "courses" : activeKey === "2" ? "sessions" : "lessons"}...`}
          className="search-input mb-4"
        />
        {activeKey === "1" && <FilterStatus onStatusChange={handleStatusChange} />}
      </div>
      <Tabs defaultActiveKey="1" activeKey={activeKey} onChange={handleTabChange} items={items} />
    </div>
  );
};

export default ManageCourses;
