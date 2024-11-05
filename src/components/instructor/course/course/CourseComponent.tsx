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
  };

  return (
    <div className="">
      <DisplayCourse
        searchTerm={searchTerm}
        statusFilter={statusFilter as StatusType}
        onSearch={handleSearch}
        onStatusChange={handleStatusChange}
      />
    </div>
  );
};

export default CourseComponent;
