import React, { useEffect, useState } from "react";
import { Table, message } from "antd";
import { formatDate } from "../../../utils/helper";
import { SessionService } from "../../../services/session/session.service";
import { SessionResponsePageData } from "../../../models/api/responsive/session/session.response.model";
import { SessionRequestModel } from "../../../models/api/request/session/session.request.model";

interface SessionManagementProps {
  searchTerm: string;
}

const SessionManagement: React.FC<SessionManagementProps> = ({ searchTerm }) => {
  const [sessionData, setSessionData] = useState<SessionResponsePageData[]>([]);

  useEffect(() => {
    const fetchSessions = async () => {
      try {
        const params: SessionRequestModel = {
          searchCondition: {
            keyword: searchTerm,
            course_id: "",
            is_position_order: false,
            is_delete: false
          },
          pageInfo: {
            pageNum: 1,
            pageSize: 10
          }
        };
        const response = await SessionService.getSession(params);
        setSessionData(response.data.data.pageData as unknown as SessionResponsePageData[]);
      } catch (error) {
        message.error("Failed to fetch sessions");
      }
    };

    fetchSessions();
  }, [searchTerm]);

  const columns = [
    {
      title: "ID",
      dataIndex: "_id", 
      key: "_id",
      render: (_: string, __: SessionResponsePageData, index: number) => index + 1
    },
    {
      title: "Name",
      dataIndex: "name",
      key: "name"
    },
    {
      title: "Course Name",
      dataIndex: "course_name",
      key: "course_name",
      render: (course_name: string) => course_name
    },
    {
      title: "Created At", 
      dataIndex: "created_at",
      key: "created_at",
      render: (date: string) => formatDate(new Date(date))
    }
  ];

  const filteredSessions = sessionData.filter((session) =>
    session.name.toLowerCase().includes(searchTerm.toLowerCase())
  );
  console.log(filteredSessions);
  return (
    <>
      <Table columns={columns} dataSource={filteredSessions} rowKey="_id" />
    </>
  );
};

export default SessionManagement;
