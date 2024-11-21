import { useCallback, useEffect, useState } from "react";
import Table from "antd/es/table";
import { Pagination, Button } from "antd";
import { EyeOutlined } from "@ant-design/icons";
import CustomSearch from "../../../generic/search/CustomSearch";
import EditButton from "./EditButton";
import DeleteButton from "./DeleteButton";
import CreateButton from "./CreateButton";
import { SessionService } from "../../../../services/session/session.service";
// import { CourseService } from "../../../../services/course/course.service";
import { formatDate } from "../../../../utils/helper";
import { DisplaySessionResponse } from "../../../../models/api/responsive/session/session.response.model";
import DetailModal from "./DetailModal";
const DisplaySession = ({ refreshKey }: { refreshKey: number }) => {
  const [sessions, setSessions] = useState<DisplaySessionResponse[]>([]);
  const [searchKeyword, setSearchKeyword] = useState("");
  const [pageNum, setPageNum] = useState<number>(1);
  const [pageSize, setPageSize] = useState<number>(10);
  const [totalItems, setTotalItems] = useState<number>(0);
  const [isDetailModalVisible, setIsDetailModalVisible] = useState(false);
  const [selectedSessionId, setSelectedSessionId] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const fetchSessions = useCallback(async (page: number, size: number, keyword: string) => {
    try {
      setLoading(true);
      const sessionResponse = await SessionService.getSession({
        searchCondition: {
          keyword: keyword,
          course_id: "",
          is_position_order: false,
          is_delete: false
        },
        pageInfo: { pageNum: page, pageSize: size }
      });

      // const sessionData = sessionResponse.data?.data?.pageData || [];
      // const courseIds = Array.from(new Set(sessionData.map((session: any) => session.course_id)));
      // const courseDataArray = await Promise.all(
      //   courseIds.map(async (id) => {
      //     const response = await CourseService.getCourseById(id);
      //     return response.data?.data;
      //   })
      // );

      // const flattenedCourseDataArray = courseDataArray.flat();
      // const coursesMap = new Map(flattenedCourseDataArray.map((course: any) => [course._id, course.name]));

      const sessionsWithCourseNames = sessionResponse.data?.data?.pageData.map((session: any) => ({
        pageData: {
          ...session,
        },
        pageInfo: {
          pageNum: 1,
          pageSize: 10,
          totalItems: 0,
          totalPages: 0
        }
      }));

      setSessions(sessionsWithCourseNames);
      setTotalItems(sessionResponse.data?.data?.pageInfo?.totalItems || 0);
    } catch (error) {
      console.error("Error fetching data:", error);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchSessions(pageNum, pageSize, searchKeyword);
  }, [pageNum, pageSize, searchKeyword, fetchSessions, refreshKey]);

  const handleSearch = (searchText: string) => {
    setPageNum(1);
    setSearchKeyword(searchText);
  };

  const columns = [
    {
      title: "Name",
      key: "name",
      dataIndex: ["pageData", "name"],
      render: (text: string) => text || "N/A"
    },
    {
      title: "Course Name",
      key: "course_name",
      dataIndex: ["pageData", "course_name"],
      render: (text: string) => text || "N/A"
    },
    {
      title: "Created At",
      key: "created_at",
      dataIndex: ["pageData", "created_at"],
      render: (text: Date) => (text ? formatDate(text) : "N/A")
    },
    {
      title: "Actions",
      key: "actions",
      render: (_: any, record: DisplaySessionResponse) => renderActions(record)
    }
  ];

  const renderActions = (record: DisplaySessionResponse) => (
    <div className="flex space-x-3">
      <EditButton data={record.pageData} onSessionEdited={() => fetchSessions(pageNum, pageSize, searchKeyword)} fetchSessionDetails={fetchSessionDetails} />
      <DeleteButton data={record.pageData} onSessionDeleted={() => fetchSessions(pageNum, pageSize, searchKeyword)} />
      <Button
        onClick={() => {
          setSelectedSessionId(record.pageData._id);
          setIsDetailModalVisible(true);
        }}  
        className="bg-gradient-tone text-white"
        icon={<EyeOutlined />}
      />
    </div>
  );

  const fetchSessionDetails = async (sessionId: string) => {
    try {
      const sessionDetails = await SessionService.getSessionDetail(sessionId);
      return sessionDetails.data;
    } catch (error) {
      console.error("Failed to fetch session details:", error);
      return null;
    }
  };

    return (
      <>
      <div className="mb-4 mt-4 flex justify-between">
        <CustomSearch onSearch={handleSearch} placeholder="Search by session name" className="w-1/5" />
        <CreateButton onSessionCreated={() => fetchSessions(pageNum, pageSize, searchKeyword)} />
      </div>

      <Table loading={loading} columns={columns} dataSource={sessions} rowKey={(record) => record.pageData._id} pagination={false} locale={{ emptyText: "No data available" }} />
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
      <DetailModal
        sessionId={selectedSessionId}
        isVisible={isDetailModalVisible}
        onClose={() => setIsDetailModalVisible(false)}
      />
      </>
    );
 
};

export default DisplaySession;
