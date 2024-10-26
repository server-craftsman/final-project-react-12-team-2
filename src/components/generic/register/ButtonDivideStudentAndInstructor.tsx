import React from "react";
import { Radio } from "antd";

const ButtonDivideStudentAndInstructor: React.FC<{
  onSelectRole: (role: string) => void;
}> = ({ onSelectRole }) => {
  return (
    <div className="justify-center space-x-4 mb-4">
      <Radio.Group onChange={(e) => onSelectRole(e.target.value)} defaultValue="student">
        <Radio value="student" type="primary">
          Student
        </Radio>
        <Radio value="instructor" type="primary">
          Instructor
        </Radio>
      </Radio.Group>
    </div>
  );
};

export default ButtonDivideStudentAndInstructor;
