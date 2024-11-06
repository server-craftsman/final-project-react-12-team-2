import DisplayCourse from "./DisplayCourse";
import { useState } from "react";
import { StatusType } from "../../../../app/enums";

const CourseComponent = () => {
  const [searchTerm, setSearchTerm] = useState<string>("");
  const [statusFilter, setStatusFilter] = useState<StatusType | "">("");
  const [tempStatusFilter, setTempStatusFilter] = useState<StatusType | "">("");
  const handleSearch = (value: string) => {
    setSearchTerm(value);
    setStatusFilter(tempStatusFilter);
  };

  const handleStatusChange = (status: StatusType | "") => {
    setTempStatusFilter(status);
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
