import React from "react";
import { useParams, Link } from "react-router-dom";
import sessionsData from "../../../data/sessions.json";
import coursesData from "../../../data/courses.json";
import lessonsData from "../../../data/lessons.json";
import { HomeOutlined, BookOutlined } from "@ant-design/icons";
import { Card, Typography, List, Button, Collapse } from "antd";

const { Title, Paragraph } = Typography;

const SessionDetails: React.FC = () => {
  const { courseId, sessionId } = useParams<{
    courseId: string;
    sessionId: string;
  }>();
  const session = sessionsData.sessions.find((s) => s.id === sessionId);
  const course = coursesData.courses.find((c) => c.id === courseId);
  const lessons = lessonsData.lessons.filter((l) => l.session_id === sessionId);

  if (!session || !course) {
    return <div>Session not found</div>;
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <Link to={`/course/${courseId}`} className="mb-6 flex items-center text-blue-600 hover:text-blue-800">
        <HomeOutlined className="mr-2" />
        <span>Back to Course</span>
      </Link>

      <Card className="mb-8">
        <Title level={2}>{session.name}</Title>
        <Paragraph>{session.description}</Paragraph>
      </Card>

      <Title level={3} className="mb-4">
        Lessons in this Session
      </Title>
      <List
        dataSource={lessons}
        renderItem={(lesson) => (
          <List.Item>
            <Collapse
              className="w-full"
              items={[
                {
                  key: lesson.id,
                  label: (
                    <div className="flex w-full items-center">
                      <BookOutlined className="mr-4 text-2xl text-blue-500" />
                      <div className="flex-grow">
                        <div className="text-lg font-semibold">{lesson.name}</div>
                      </div>
                      <div className="text-sm text-gray-500">{lesson.full_time} min</div>
                    </div>
                  ),
                  children: (
                    <div className="p-4">
                      <Paragraph>{lesson.description}</Paragraph>
                      <Link to={`/course/${courseId}/lesson/${lesson.id}`}>
                        <Button type="primary">Go to Lesson</Button>
                      </Link>
                    </div>
                  )
                }
              ]}
            />
          </List.Item>
        )}
      />
    </div>
  );
};

export default SessionDetails;
