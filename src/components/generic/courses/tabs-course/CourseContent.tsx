import React from 'react';
import { Typography, Collapse, List, Button } from 'antd';
import { PlayCircleOutlined } from '@ant-design/icons';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';

const { Title, Paragraph } = Typography;

interface CourseContentProps {
  sessions: any[];
  lessons: any[];
  courseId: string;
  activeSessionId: string | null;
  setActiveSessionId: (id: string | null) => void;
}

const CourseContent: React.FC<CourseContentProps> = ({ sessions, lessons, courseId, activeSessionId, setActiveSessionId }) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      {sessions.map(session => (
        <Collapse
          key={session.id}
          className="mb-8 bg-gradient-to-r from-[#f3e7ff] to-[#e7f0ff] shadow-xl rounded-lg overflow-hidden border-2 border-[#8529ff]"
          activeKey={activeSessionId ?? ''}
          onChange={(key) => setActiveSessionId(Array.isArray(key) ? key[0] : key)}
          items={[
            {
              key: session.id,
              label: (
                <Title level={4} className="text-2xl font-bold text-[#1a237e] mb-0 pl-4 border-l-4 border-[#8529ff]">
                  {session.name}
                </Title>
              ),
              children: (
                <div>
                  <Paragraph>{session.description}</Paragraph>
                  <List
                    dataSource={lessons.filter(lesson => lesson.session_id === session.id)}
                    renderItem={lesson => (
                      <List.Item>
                        <Link to={`/course/${courseId}/session/${session.id}/lesson/${lesson.id}`} className="w-full">
                          <Button type="link" block className="text-left">
                            <PlayCircleOutlined className="mr-2" />
                            {lesson.name} ({lesson.full_time} min)
                          </Button>
                        </Link>
                      </List.Item>
                    )}
                  />
                </div>
              ),
            },
          ]}
        />
      ))}
    </motion.div>
  );
};

export default CourseContent;
