import React from 'react';
import { Typography, Collapse, List, Button } from 'antd';
import { PlayCircleOutlined } from '@ant-design/icons';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { CourseContentProps } from '../../../../models/objects/course/CourseContentProps';
const { Title, Paragraph } = Typography;

const CourseContent: React.FC<CourseContentProps> = ({ sessions, lessons, courseId, activeSessionId, setActiveSessionId }) => {
  return (
    <motion.div
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.5 }}
    >
      {sessions.map(session => (
        <Collapse
          key={session.id}
          className="mb-8 bg-gradient-to-r from-[#f3e7ff] to-[#e7f0ff] shadow-xl rounded-lg overflow-hidden border-2 border-[#8529ff] text-left"
          activeKey={activeSessionId === session.id ? [session.id] : []}
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
                <div className="p-12 flex flex-col gap-6 justify-start items-start bg-white shadow-2xl rounded-lg border border-gray-300">
                  <Paragraph className="text-xl text-gray-800 leading-relaxed">
                    {session.description}
                  </Paragraph>
                  <List
                    dataSource={lessons.filter(lesson => lesson.session_id === session.id).sort((a, b) => a.order - b.order)}
                    renderItem={lesson => (
                      <List.Item className="text-left flex flex-row justify-start items-start">
                        <Link to={`/course/${courseId}/lesson/${lesson.id}`} className="w-full text-left">
                          <Button type="link" block className="text-left text-xl text-[#1a237e] hover:text-[#8529ff] flex items-center">
                            <PlayCircleOutlined className="mr-2 text-[#8529ff]" />
                            <span className="flex-grow">{lesson.name}</span>
                            <span className="text-gray-500">({lesson.full_time} min)</span>
                          </Button>
                        </Link>
                      </List.Item>
                    )}
                    className="text-left"
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
