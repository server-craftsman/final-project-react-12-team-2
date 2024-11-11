import DisplayCourse from "./DisplayCourse";
import { useState } from "react";
import { StatusType } from "../../../../app/enums";

interface CourseComponentProps {
  refreshKey: number; // Assuming refreshKey is a number
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

  //debug
  // useEffect(() => {
  // }, [refreshKey]);

  return (
    <div className="">
      <DisplayCourse searchTerm={searchTerm} statusFilter={statusFilter as StatusType} onSearch={handleSearch} onStatusChange={handleStatusChange} refreshKey={refreshKey} />
    </div>
  );
};

export default CourseComponent;
