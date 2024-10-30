import DisplayCourse from "./DisplayCourse";
import { useState } from "react";
import { CourseStatusEnum } from "../../../../models/prototype/Course";
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
        // Ensure each child in a list within DisplayCourse has a unique key
      />
    </div>
  );
};

export default CourseComponent;
