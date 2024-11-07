import { Col, Row, Tag, Layout, Tabs } from "antd";
import { ArrowRightOutlined } from "@ant-design/icons";
import React, { useState } from "react";
import { Content } from "antd/es/layout/layout";
import CourseComponent from "../../../components/instructor/course/course/CourseComponent";
import SessionComponent from "../../../components/instructor/course/session/SessionComponent";
import LessionComponent from "../../../components/instructor/course/lesson/LessionComponent";
import { courseStatusColor } from "../../../utils/courseStatus";
import { StatusType } from "../../../app/enums";

const CourseManagement = () => {
  const [activeTabKey, setActiveTabKey] = useState("course");
  const [refreshKey, setRefreshKey] = useState(0);

  const statusLabelList = [
    {
      name: StatusType.NEW,
      color: `${courseStatusColor[StatusType.NEW]} hover:shadow-lg transition-all duration-300`,
      title: "This is a new course",
      description: "Your course has been created and is ready for editing"
    },
    {
      name: StatusType.WAITING_APPROVE,
      color: `${courseStatusColor[StatusType.WAITING_APPROVE]} hover:shadow-lg transition-all duration-300`,
      title: "Awaiting Approval",
      description: "Your course is being reviewed by our admin team"
    },
    {
      name: StatusType.APPROVE,
      color: `${courseStatusColor[StatusType.APPROVE]} hover:shadow-lg transition-all duration-300`,
      title: "Course Approved",
      description: "Congratulations! Your course has been approved"
    },
    {
      name: StatusType.REJECT,
      color: `${courseStatusColor[StatusType.REJECT]} hover:shadow-lg transition-all duration-300`,
      title: "Course Rejected",
      description: "Please review admin feedback and make necessary changes"
    },
    {
      name: StatusType.ACTIVE,
      color: `${courseStatusColor[StatusType.ACTIVE]} hover:shadow-lg transition-all duration-300`,
      title: "Course Active",
      description: "Your course is live and available to students"
    },
    {
      name: StatusType.INACTIVE,
      color: `${courseStatusColor[StatusType.INACTIVE]} hover:shadow-lg transition-all duration-300`,
      title: "Course Inactive",
      description: "Your course is currently not visible to students"
    }
  ];

  const itemsTab = [
    {
      key: "course",
      label: "Course",
      children: <CourseComponent refreshKey={refreshKey} />
    },
    {
      key: "session",
      label: "Session",
      children: <SessionComponent refreshKey={refreshKey} />
    },
    {
      key: "lesson",
      label: "Lesson",
      children: <LessionComponent refreshKey={refreshKey} />
    }
  ];

  const renderTagMenu = () => {
    return (
      <Row className="mb-8 justify-center align-middle">
        {statusLabelList.map((status, index) => (
          <React.Fragment key={status.name}>
            <Col className="group cursor-pointer text-center">
              <Tag className={`${status.color} px-2 py-1 text-xs capitalize`}>{status.name.toLowerCase().replace("_", " ")}</Tag>
              <div className="mt-1">
                <div className="text-sm font-medium text-slate-700">{status.title}</div>
                <div className="max-w-[150px] text-xs text-slate-500">{status.description}</div>
              </div>
            </Col>
            {index < statusLabelList.length - 1 && (
              <Col>
                <ArrowRightOutlined className="mx-2 mt-3 text-sm text-slate-400" />
              </Col>
            )}
          </React.Fragment>
        ))}
      </Row>
    );
  };

  const handleTabChange = (key: string) => {
    setActiveTabKey(key);
    setRefreshKey((prevKey) => prevKey + 1);
  };

  return (
    <Layout className="layout">
      {renderTagMenu()}
      <Content className="">
        <>
          <Tabs
            activeKey={activeTabKey}
            onChange={handleTabChange}
            items={itemsTab.map((item) => ({
              ...item,
              children: React.cloneElement(item.children, { refreshKey })
            }))}
          />
        </>
      </Content>
    </Layout>
  );
};

export default CourseManagement;
