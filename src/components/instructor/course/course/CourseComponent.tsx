import DisplayCourse from "./DisplayCourse";
import { useState } from "react";
import { CourseStatusEnum } from "../../../../models/Course";
const CourseComponent = () => {
  const [searchTerm, setSearchTerm] = useState<string>("");
  const [statusFilter, setStatusFilter] = useState<CourseStatusEnum | "">("");

  const handleSearch = (value: string) => {
    setSearchTerm(value);
  };

  const handleStatusChange = (status: CourseStatusEnum | "") => {
    setStatusFilter(status);
    // Ensure the status filter is updated
  };

  return (
    <div>
      <DisplayCourse
        searchTerm={searchTerm}
        statusFilter={statusFilter}
        onSearch={handleSearch}
        onStatusChange={handleStatusChange}
      />
    </div>
  );
};

export default CourseComponent;
