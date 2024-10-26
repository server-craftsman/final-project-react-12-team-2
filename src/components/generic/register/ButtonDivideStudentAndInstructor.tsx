import { memo } from "react";
import { Radio } from "antd";
import { UserOutlined, BookOutlined } from "@ant-design/icons";

const OPTIONS = [
  { value: 'student', icon: <UserOutlined />, label: 'Student' },
  { value: 'instructor', icon: <BookOutlined />, label: 'Instructor' }
] as const;

const ButtonDivideStudentAndInstructor = memo(({ 
  onSelectRole 
}: {
  onSelectRole: (role: string) => void;
}) => (
  <div className="mb-8 flex justify-center">
    <Radio.Group
      defaultValue="student" 
      buttonStyle="outline"
      onChange={e => onSelectRole(e.target.value)}
      className="flex gap-2 w-full max-w-6xl"
    >
      {OPTIONS.map(({ value, icon, label }) => (
        <Radio.Button
          key={value}
          value={value}
          className="flex-1 h-16 rounded-3xl border-2 border-[#1a237e]/20 bg-white shadow-md transition-all duration-300 hover:border-[#1a237e]/40 hover:bg-[#1a237e]/5 hover:shadow-lg active:scale-95 focus:border-[#1a237e] focus:outline-none focus:ring-2 focus:ring-[#1a237e]/20 focus:ring-offset-2"
        >
          <div className="flex h-full items-center justify-center gap-3">
            <span className="text-2xl text-indigo-600">{icon}</span>
            <span className="text-lg font-bold text-indigo-900">{label}</span>
          </div>
        </Radio.Button>
      ))}
    </Radio.Group>
  </div>
));

ButtonDivideStudentAndInstructor.displayName = 'ButtonDivideStudentAndInstructor';

export default ButtonDivideStudentAndInstructor;
