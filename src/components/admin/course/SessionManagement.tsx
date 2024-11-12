import React, { useEffect, useState } from "react";
import { Table, message, Pagination } from "antd";
import { formatDate } from "../../../utils/helper";
import { SessionService } from "../../../services/session/session.service";
import { SessionResponsePageData } from "../../../models/api/responsive/session/session.response.model";
import { SessionRequestModel } from "../../../models/api/request/session/session.request.model";

interface SessionManagementProps {
  searchTerm: string;
  activeKey: string;
}

const SessionManagement: React.FC<SessionManagementProps> = ({ searchTerm, activeKey }) => {
  const [sessionData, setSessionData] = useState<SessionResponsePageData[]>([]);
  const [pageNum, setPageNum] = useState<number>(1);
  const [pageSize, setPageSize] = useState<number>(10);
  const [totalItems, setTotalItems] = useState<number>(0);

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
            pageNum,
            pageSize
          }
        };
        const response = await SessionService.getSession(params);
        setSessionData(response.data.data.pageData as unknown as SessionResponsePageData[]);
        setTotalItems(response.data.data.pageInfo.totalItems);
      } catch (error) {
        message.error("Failed to fetch sessions");
      }
    };

    fetchSessions();
  }, [searchTerm, activeKey, pageNum, pageSize]);

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

  return (
    <>
      <Table columns={columns} dataSource={sessionData} rowKey="_id" pagination={false} />
      <div className="mt-5 flex justify-start">
        <Pagination
          current={pageNum}
          pageSize={pageSize}
          total={totalItems}
          showTotal={(total, range) => `${range[0]}-${range[1]} of ${total} items`}
          onChange={(page, pageSize) => {
            setPageNum(page);
            setPageSize(pageSize);
          }}
          showSizeChanger
          className="bg-pagination"
        />
      </div>
    </>
  );
};

export default SessionManagement;
