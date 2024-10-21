import { Col, Row, Tag, Layout, Button, Tabs } from "antd";
import { ArrowRightOutlined } from "@ant-design/icons";
import React, { useState } from "react";
import { Content } from "antd/es/layout/layout";
import CourseComponent from "../../../components/instructor/course/course/CourseComponent";
import SessionComponent from "../../../components/instructor/course/session/SessionComponent";
import LessionComponent from "../../../components/instructor/course/lesson/LessionComponent";
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

  const itemsTab = [
    {
      key: "course",
      label: "Course",
      children: <CourseComponent />,
    },
    {
      key: "session",
      label: "Session",
      children: <SessionComponent />,
    },
    {
      key: "lesson",
      label: "Lesson",
      children: <LessionComponent />,
    },
  ];

  const renderTagMenu = () => {
    return (
      <Row className="mb-5 justify-center align-middle">
        {statusLabelList.map((status, index) => (
          <React.Fragment key={index}>
            <Col className="text-center">
              <Tag color={status.color} className="px-5 py-0 text-base">
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
  // const renderMainContent = () => {
  //   switch (activeTab) {
  //     case "course":
  //       return <CourseComponent />;
  //     case "session":
  //       return <SessionComponent />;
  //     case "lesson":
  //       return <LessionComponent />;
  //   }
  // };
  return (
    <Layout className="layout">
      {renderTagMenu()}
      <Content className="">
        <>
          <Tabs items={itemsTab} onChange={(key) => setActiveTab(key)} />
          {/* {renderMainContent()} */}
        </>
      </Content>
    </Layout>
  );
};

export default CourseManagement;
