import React from 'react';
import { Button, Card, Progress, Divider, Typography } from 'antd';
import { LeftOutlined, RightOutlined } from '@ant-design/icons';

const { Title, Text } = Typography;

interface LessonSidebarProps {
  course?: { name: string };
  session?: { name: string };
  lesson?: {
    position_order: number;
    created_at: string;
    updated_at: string;
  };
  onContinueLesson: () => void;
  onPreviousLesson: () => void;
  onNextLesson: () => void;
  previousLesson: boolean;
  nextLesson: boolean;
}

const LessonSidebar: React.FC<LessonSidebarProps> = ({
  course,
  session,
  lesson,
  onContinueLesson,
  onPreviousLesson,
  onNextLesson,
  previousLesson,
  nextLesson,
}) => {
  return (
    <Card className="shadow-lg rounded-lg sticky top-8">
      <Title level={4} className="mb-4">Course Progress</Title>
      <Progress percent={30} status="active" />
      <Button type="primary" size="large" block className="mb-4 h-12 text-lg bg-[#1a237e] text-white hover:bg-[#1a237e] hover:text-white" onClick={onContinueLesson}>
        Continue Lesson
      </Button>
      <Button size="large" block className="mb-6 h-12 text-lg">
        Mark as Complete
      </Button>
      <Divider />
      <Title level={4} className="mb-4">Lesson Details:</Title>
      <ul className="list-disc list-inside text-gray-600">
        <li>Course: {course?.name}</li>
        <li>Session: {session?.name}</li>
        <li>Position: {lesson?.position_order}</li>
        <li>Created: {new Date(lesson?.created_at || '').toLocaleDateString()}</li>
        <li>Updated: {new Date(lesson?.updated_at || '').toLocaleDateString()}</li>
      </ul>
      <Divider />
      <Title level={4} className="mb-4">Navigation Lesson</Title>
      <div className="flex w-50 justify-between">
        <Button 
          type="default" 
          size="small"
          className="flex-1 mr-1" 
          onClick={onPreviousLesson}
          disabled={!previousLesson}
        >
          <LeftOutlined /> Previous
        </Button>
        <Button 
          type="primary" 
          size="small"
          className="flex-1"
          onClick={onNextLesson}
          disabled={!nextLesson}
        >
          Next <RightOutlined />
        </Button>
      </div>
    </Card>
  );
};

export default LessonSidebar;