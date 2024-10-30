import { useEffect, useState } from "react";
import Table from "antd/es/table";
import { Pagination } from "antd";
import CustomSearch from "../../../generic/search/CustomSearch";
// import { Lesson, LessonType } from "../../../../models/prototype/Lesson";
import EditButton from "./EditButton";
import DeleteButton from "./DeleteButton";
import CreateButton from "./CreateButton";
import { SessionService } from "../../../../services/session/session.service";
import { CourseService } from "../../../../services/course/course.service";
import { formatDate } from "../../../../utils/helper";
import { SessionResponse } from "../../../../models/api/responsive/session/session.response.model";

import { LessonType } from "../../../../app/enums";
const DisplaySession = () => {
  const [sessions, setSessions] = useState<SessionResponse[]>([]);
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

      console.log('Session Response:', sessionResponse);

      const sessionData = sessionResponse.data?.data?.pageData || [];
      
      if (!Array.isArray(sessionData)) {
        console.error("Session data is not an array:", sessionData);
        return;
      }

      const courseResponse = await CourseService.getCourse({
        searchCondition: {
          keyword: "",
          category_id: "",
          status: "active",
          is_delete: false
        },
        pageInfo: { pageNum: 1, pageSize: 100 }
      });

      console.log('Course IDs and Names:', 
        courseResponse.data?.data?.pageData?.map((c: any) => ({id: c._id, name: c.name}))
      );

      const courseData = courseResponse.data?.data?.pageData || [];
      
      if (!courseData || courseData.length === 0) {
        console.warn("No course data available");
      }

      const coursesMap = new Map(
        courseData?.map((course: any) => {
          console.log('Mapping course:', course._id, course.name);
          return [course._id, course.name];
        }) || []
      );

      const sessionsWithCourseNames = sessionData.map((session: any) => {
        console.log('Looking up course for session:', session._id, session.course_id);
        console.log('Found course name:', coursesMap.get(session.course_id));
        
        return {
          pageData: {
            _id: session._id,
            name: session.name,
            course_id: session.course_id,
            course_name: coursesMap.get(session.course_id) || "Unassigned",
            created_at: session.created_at,
            user_id: session.user_id,
            description: session.description || '',
            position_order: session.position_order || 0,
            updated_at: session.updated_at || new Date(),
            is_deleted: session.is_deleted || false
          },
          pageInfo: {
            pageNum: 1,
            pageSize: 100,
            totalItems: 0,
            totalPages: 0 
          }
        };
      });

      console.log('Processed Sessions:', sessionsWithCourseNames);

      setSessions(sessionsWithCourseNames as SessionResponse[]);
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

  const renderActions = (record: SessionResponse) => (
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
      render: (_: any, record: SessionResponse) => renderActions(record)
    }
  ];
  // console.log(sessions);
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
        />
      </div>
    </>
  );
};

export default DisplaySession;
