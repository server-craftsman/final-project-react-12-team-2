import DisplayCourse from "./DisplayCourse";
import { useState } from "react";
import { StatusType } from "../../../../app/enums";
const CourseComponent = () => {
  const [searchTerm, setSearchTerm] = useState<string>("");
  const [statusFilter, setStatusFilter] = useState<StatusType | "">("");

  const handleSearch = (value: string) => {
    setSearchTerm(value);
  };

  const handleStatusChange = (status: StatusType | "") => {
    setStatusFilter(status);
    // Ensure the status filter is updated
  };

  return (
    <div className="">
      <DisplayCourse
        searchTerm={searchTerm}
        statusFilter={statusFilter as StatusType}
        onSearch={handleSearch}
        onStatusChange={handleStatusChange}
        // Ensure each child in a list within DisplayCourse has a unique key
      />
    </div>
  );
};

export default CourseComponent;
