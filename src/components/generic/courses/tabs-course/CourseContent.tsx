import React from "react";
import { Typography, Collapse, List, Button } from "antd";
import { PlayCircleOutlined } from "@ant-design/icons";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { CourseContentProps } from "../../../../models/objects/course/CourseContentProps";
const { Title, Paragraph } = Typography;

const CourseContent: React.FC<CourseContentProps> = ({ sessions, lessons, courseId, activeSessionId, setActiveSessionId }) => {
  console.log("Active Session ID:", activeSessionId);
  console.log("Sessions:", sessions);
  console.log("Lessons:", lessons);

  return (
    <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.5 }}>
      {sessions.map((session) => (
        <Collapse
          key={session._id}
          className="mb-8 overflow-hidden rounded-lg border-2 border-[#1a237e] bg-gradient-to-r from-[#eae7ff] to-[#e7f0ff] text-left shadow-xl"
          activeKey={activeSessionId === session._id ? [session._id] : []}
          onChange={(key) => {
            const newActiveKey = Array.isArray(key) ? key[0] : key;
            setActiveSessionId(newActiveKey === activeSessionId ? null : newActiveKey);
            console.log("New Active Key:", newActiveKey);
          }}
        >
          <Collapse.Panel
            key={session._id}
            header={
              <Title level={4} className="mb-0 border-l-4 border-[#1a237e] pl-4 text-2xl font-bold text-[#1a237e]">
                {session.name}
              </Title>
            }
          >
            <div className="flex flex-col items-start justify-start gap-6 rounded-lg border border-gray-300 bg-white p-12 shadow-2xl">
              <Paragraph className="text-xl leading-relaxed text-gray-800">{session.description}</Paragraph>
              <List
                dataSource={lessons.filter((lesson) => lesson.session_id === session._id).sort((a, b) => a.position_order - b.position_order)}
                renderItem={(lesson) => (
                  <List.Item key={lesson._id} className="flex flex-row items-start justify-start text-left">
                    <Link to={`/course/${courseId}/lesson/${lesson._id}`} className="w-full text-left">
                      <Button type="link" block className="flex items-center text-left text-xl text-[#1a237e] hover:text-[#1a237e]">
                        <PlayCircleOutlined className="mr-2 text-[#1a237e]" />
                        <span className="flex-grow">{lesson.name}</span>
                        <span className="text-gray-500">({lesson.full_time} min)</span>
                      </Button>
                    </Link>
                  </List.Item>
                )}
                className="text-left"
              />
            </div>
          </Collapse.Panel>
        </Collapse>
      ))}
    </motion.div>
  );
};

export default CourseContent;
