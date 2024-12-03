import React, { useEffect, useState } from "react";
import { Button, Table } from "antd";
import { EyeOutlined } from "@ant-design/icons";
import { formatDate } from "../../../utils/helper";
import { SessionService } from "../../../services/session/session.service";
import { SessionResponsePageData } from "../../../models/api/responsive/session/session.response.model";
import { SessionRequestModel } from "../../../models/api/request/session/session.request.model";
import ModalSessionModal from "./ModalSessionDetail";
import { notificationMessage } from "../../../utils/helper";

interface SessionManagementProps {
  searchTerm: string;
  activeKey: string;
}

const SessionManagement: React.FC<SessionManagementProps> = ({ searchTerm, activeKey }) => {
  const [sessionData, setSessionData] = useState<SessionResponsePageData[]>([]);
  const [totalItems, setTotalItems] = useState<number>(0);
  const [pagination, setPagination] = useState({ current: 1, pageSize: 10 });
  const [selectedSessionDetail, setSelectedSessionDetail] = useState<SessionResponsePageData | null>(null);
  const [isSessionDetailModalVisible, setIsSessionDetailModalVisible] = useState(false);

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
            pageNum: pagination.current,
            pageSize: pagination.pageSize
          }
        };
        const response = await SessionService.getSession(params);
        setSessionData(response.data.data.pageData as unknown as SessionResponsePageData[]);
        setTotalItems(response.data.data.pageInfo.totalItems);
      } catch (error) {
        notificationMessage("Failed to fetch sessions", "error");
      }
    };

    fetchSessions();
  }, [searchTerm, activeKey, pagination]);

  const showSessionDetailModal = async (sessionId: string) => {
    try {
      const response = await SessionService.getSessionDetail(sessionId);
      setSelectedSessionDetail(response.data.data);
      setIsSessionDetailModalVisible(true);
    } catch (error) {
      console.error("Failed to fetch lesson details", error);
    }
  };

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
    },
    {
      title: "Action",
      key: "action",
      dataIndex: "action",
      render: (_: any, record: SessionResponsePageData) => (
        <div className="flex space-x-3">
          <Button icon={<EyeOutlined />} onClick={() => showSessionDetailModal(record._id)} className="bg-gradient-tone text-white" />
        </div>
      )
    }
  ];

  if (sessionData && totalItems) {
    return (
      <>
    <Table
      columns={columns}
      dataSource={sessionData}
      rowKey="_id"
      pagination={{
        current: pagination.current,
        pageSize: pagination.pageSize,
        total: totalItems,
        showTotal: (total, range) => `${range[0]}-${range[1]} of ${total} items`,
        onChange: (page, pageSize) => {
          setPagination({ current: page, pageSize });
        },
        showSizeChanger: true,
        className: "bg-pagination",
        position: ["bottomLeft"]
        }}
      />
      <ModalSessionModal
          sessionDetail={selectedSessionDetail}
          visible={isSessionDetailModalVisible}
          onClose={() => setIsSessionDetailModalVisible(false)}
        />
      </>
    );
  } 
};

export default SessionManagement;
