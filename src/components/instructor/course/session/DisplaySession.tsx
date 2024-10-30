import { useEffect, useState } from "react";
import Table from "antd/es/table";
import { Pagination } from "antd";
import CustomSearch from "../../../generic/search/CustomSearch";
import EditButton from "./EditButton";
import DeleteButton from "./DeleteButton";
import CreateButton from "./CreateButton";
import { SessionService } from "../../../../services/session/session.service";
import { CourseService } from "../../../../services/course/course.service";
import { formatDate } from "../../../../utils/helper";
import { DisplaySessionResponse } from "../../../../models/api/responsive/session/session.response.model";

const DisplaySession = () => {
  const [sessions, setSessions] = useState<DisplaySessionResponse[]>([]);
  const [loading, setLoading] = useState(false);
  const [searchKeyword, setSearchKeyword] = useState("");
  const [pageNum, setPageNum] = useState<number>(1);
  const [pageSize, setPageSize] = useState<number>(10);
  const [totalItems, setTotalItems] = useState<number>(0);

  const fetchSessions = async (page: number, size: number, keyword: string) => {
    setLoading(true);
    try {
      const sessionResponse = await SessionService.getSession({
        searchCondition: {
          keyword: keyword,
          course_id: "",
          is_position_order: false,
          is_delete: false
        },
        pageInfo: { pageNum: page, pageSize: size }
      });

      const sessionData = sessionResponse.data?.data?.pageData || [];
      
      if (!Array.isArray(sessionData)) {
        console.error("Session data is not an array:", sessionData);
        return;
      }

      const courseResponse = await CourseService.getCourseById(sessionData[0].course_id);

      const courseData = courseResponse.data?.data || [];
      const coursesMap = new Map(
        [courseData].map((course: any) => [course._id, course.name])
      );

      const sessionsWithCourseNames = sessionData.map((session: any) => ({
        pageData: {
          ...session,
          course_name: coursesMap.get(session.course_id) || "Unassigned"
        },
        pageInfo: {
          pageNum: 1,
          pageSize: 100,
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
  };

  useEffect(() => {
    fetchSessions(pageNum, pageSize, searchKeyword);
  }, [pageNum, pageSize, searchKeyword]);

  const renderActions = (record: DisplaySessionResponse) => (
    <div className="flex space-x-2">
      <EditButton data={record} />
      <DeleteButton />
    </div>
  );

  const handleSearch = (searchText: string) => {
    setSearchKeyword(searchText);
    setPageNum(1);
  };

  const columns = [
    {
      title: "Name",
      key: "name",
      dataIndex: ["pageData", "name"],
      render: (text: string) => text || 'N/A'
    },
    {
      title: "Course Name", 
      key: "course_name",
      dataIndex: ["pageData", "course_name"],
      render: (text: string) => text || 'N/A'
    },
    {
      title: "Created At",
      key: "created_at",
      dataIndex: ["pageData", "created_at"],
      render: (text: Date) => text ? formatDate(text) : 'N/A'
    },
    {
      title: "Actions",
      key: "actions",
      render: (_: any, record: DisplaySessionResponse) => renderActions(record)
    }
  ];
  return (
    <>
      <div className="mb-4 mt-4 flex justify-between">
        <CustomSearch 
          onSearch={handleSearch} 
          placeholder="Search by session name" 
          className="w-1/5" 
        />
        <CreateButton />
      </div>
     
      <Table 
        loading={loading}
        columns={columns} 
        dataSource={sessions}
        rowKey={(record) => record.pageData._id}
        pagination={false}
        locale={{ emptyText: 'No data available' }}
      />
      <div className="mt-5 flex justify-end">
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

export default DisplaySession;
