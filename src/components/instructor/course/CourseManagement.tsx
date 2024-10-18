import { Col, Row, Tag, Layout, Button } from "antd";
import { ArrowRightOutlined } from "@ant-design/icons";
import React, { useState } from "react";
import CourseComponent from "./course/CourseComponent";
import SessionComponent from "./session/SessionComponent";
import LessionComponent from "./lession/LessionComponent";
import { Content } from "antd/es/layout/layout";

const CourseManagement = () => {
  const [activeTab, setActiveTab] = useState("course");
  const statusLabelList = [
    {
      name: "New",
      color: "blue",
      title: "(This is a new course)",
    },
    {
      name: "Waiting Approve",
      color: "gold",
      title: "(Awaiting approval from admin)",
    },
    {
      name: "Approve",
      color: "green",
      title: "(Course has been approved)",
    },
    {
      name: "Reject",
      color: "volcano",
      title: "(Course has been rejected)",
    },
    {
      name: "Active",
      color: "geekblue",
      title: "(Course is currently active)",
    },
    {
      name: "Inactive",
      color: "gray",
      title: "(Course is currently inactive)",
    },
  ];

  const renderTagMenu = () => {
    return (
      <Row className="mb-5 justify-center align-middle">
        {statusLabelList.map((status, index) => (
          <React.Fragment key={index}>
            <Col className="text-center">
              <Tag color={status.color} className="text-base py-0 px-5">
                {status.name}
              </Tag>
              <div className="text-sm">{status.title}</div>
            </Col>
            {statusLabelList.length - 1 > index && (
              <Col>
                <ArrowRightOutlined className="mr-2 text-sm" />
              </Col>
            )}
          </React.Fragment>
        ))}
      </Row>
    );
  };
  const renderMainContent = () => {
    switch (activeTab) {
      case "course":
        return <CourseComponent />;
      case "session":
        return <SessionComponent />;
      case "lesson":
        return <LessionComponent />;
    }
  };
  return (
    <Layout className="layout">
      {renderTagMenu()}
      <Content className="">
        <>
          <div className="flex flex-row justify-start gap-5">
            <Button className={`${activeTab === 'course' ? 'bg-green-500' : null} `} onClick={() => setActiveTab("course")}>Course</Button>
            <Button className={`${activeTab === 'session' ? 'bg-green-500' : null} `} onClick={() => setActiveTab("session")}>Session</Button>
            <Button className={`${activeTab === 'lesson' ? 'bg-green-500' : null} `} onClick={() => setActiveTab("lesson")}>Lesson</Button>
          </div>
          {renderMainContent()}
        </>
      </Content>
    </Layout>
  );
};

export default CourseManagement;
