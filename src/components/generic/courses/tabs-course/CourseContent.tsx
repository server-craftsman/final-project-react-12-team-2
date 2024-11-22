import React from "react";
import { Typography, Collapse, List, Button, message } from "antd";
import { PlayCircleOutlined } from "@ant-design/icons";
import { Link, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { CourseContentProps } from "../../../../models/objects/course/CourseContentProps";
import { GetPublicCourseDetailResponse } from "../../../../models/api/responsive/course/course.response.model";
const { Title, Paragraph } = Typography;
import { LessonType } from "../../../../app/enums";

const checkUserInfo = (course: GetPublicCourseDetailResponse) => {
  return course?.is_purchased;
};

const CourseContent: React.FC<CourseContentProps & { course: GetPublicCourseDetailResponse }> = ({ course, sessions, lessons, courseId, activeSessionId, setActiveSessionId }) => {
  const navigate = useNavigate();
  return (
    <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.5 }}>
      {sessions.map((session) => (
        <Collapse
          key={session._id}
          className="mb-1 md:mb-8 overflow-hidden rounded-lg border-2 border-[#1a237e] bg-gradient-to-r from-[#eae7ff] to-[#e7f0ff] text-left shadow-xl"
          activeKey={activeSessionId === session._id ? [session._id] : []}
          onChange={(key) => {
            const newActiveKey = Array.isArray(key) ? key[0] : key;
            setActiveSessionId(newActiveKey === activeSessionId ? null : newActiveKey);
          }}
          items={[
            {
              key: session._id,
              label: (
                <Title level={4} className="mb-0 border-l-4 border-[#1a237e] pl-2 md:pl-4 text-lg md:text-2xl font-bold text-[#1a237e]">
                  {session.name}
                </Title>
              ),
              children: (
                <div className="flex flex-col items-start justify-start gap-2 md:gap-4 rounded-lg border border-gray-300 bg-white p-2 md:p-6 shadow-xl md:shadow-2xl">
                  <Paragraph className="text-base md:text-lg leading-relaxed text-gray-800">{session.description}</Paragraph>
                  <List
                    dataSource={lessons.filter((lesson) => lesson.session_id === session._id).sort((a, b) => a.position_order - b.position_order)}
                    renderItem={(lesson) => (
                      <List.Item key={lesson._id} className="flex flex-row items-start justify-start text-left">
                        <Link
                          to={checkUserInfo(course) ? `/course/${courseId}/lesson/${lesson._id}` : `/courses/all`} 
                          className="w-full text-left"
                          onClick={(e) => {
                            if (!checkUserInfo(course)) {
                              e.preventDefault();
                              message.warning("Please purchase this course to access the lessons");
                              setTimeout(() => {
                                navigate(`/courses/all`);
                              }, 2000);
                            }
                          }}
                        >
                          <Button type="link" block className="flex items-center text-left text-sm md:text-lg text-[#1a237e] hover:text-[#1a237e]">
                            {lesson.lesson_type === LessonType.VIDEO ? (
                              <PlayCircleOutlined className="mr-1 md:mr-2 text-[#1a237e]" />
                            ) : lesson.lesson_type === LessonType.IMAGE ? (
                              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-6">
                                <path strokeLinecap="round" strokeLinejoin="round" d="m2.25 15.75 5.159-5.159a2.25 2.25 0 0 1 3.182 0l5.159 5.159m-1.5-1.5 1.409-1.409a2.25 2.25 0 0 1 3.182 0l2.909 2.909m-18 3.75h16.5a1.5 1.5 0 0 0 1.5-1.5V6a1.5 1.5 0 0 0-1.5-1.5H3.75A1.5 1.5 0 0 0 2.25 6v12a1.5 1.5 0 0 0 1.5 1.5Zm10.5-11.25h.008v.008h-.008V8.25Zm.375 0a.375.375 0 1 1-.75 0 .375.375 0 0 1 .75 0Z" />
                              </svg>
                            ) : (
                              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-6">
                                <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 14.25v-2.625a3.375 3.375 0 0 0-3.375-3.375h-1.5A1.125 1.125 0 0 1 13.5 7.125v-1.5a3.375 3.375 0 0 0-3.375-3.375H8.25m0 12.75h7.5m-7.5 3H12M10.5 2.25H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 0 0-9-9Z" />
                              </svg>
                            )}
                            <span className="flex-grow truncate">{lesson.name}</span>
                            <span className="text-gray-500 text-xs md:text-sm ml-1 md:ml-2">({lesson.full_time} min)</span>
                          </Button>
                        </Link>
                      </List.Item>
                    )}
                    className="text-left w-full"
                  />
                </div>
              )
            }
          ]}
        />
      ))}
    </motion.div>
  );
};

export default CourseContent;
