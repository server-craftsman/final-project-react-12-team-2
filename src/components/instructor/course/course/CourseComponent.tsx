import { Button, message } from "antd";
import { useState } from "react";
import DisplayCourse from "./DisplayCourse";
import CreateCourseButton from "./CreateButton";

const CourseComponent = () => {
  const [selectedCourse, setSelectedCourse] = useState([]);

  return (
    <div>
      <div className="mb-4 flex justify-end gap-2">
        <CreateCourseButton />
        <Button
          disabled={selectedCourse.length === 0}
          onClick={() => message.info("sending to admin")}
        >
          Send to Admin
        </Button>
      </div>
      <DisplayCourse setSelectedCourse={setSelectedCourse} />
    </div>
  );
};

export default CourseComponent;
