import DisplayCourse from "./DisplayCourse";
import { useState } from "react";
import { StatusType } from "../../../../app/enums";
interface CourseComponentProps {
  refreshKey: any; // Replace 'any' with the appropriate type if known  
}

const CourseComponent = ({ refreshKey }: CourseComponentProps) => {
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
        refreshKey={refreshKey}
      />
    </div>
  );
};

export default CourseComponent;
