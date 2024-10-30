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
import { LessonResponse } from "../../../../models/api/responsive/lesson/lesson.response.model";
import { LessonType } from "../../../../app/enums";

const DisplaySession = () => {
  const [sessions, setSessions] = useState<SessionResponse[]>([]);
  const [filteredSession, setFilteredSession] = useState<SessionResponse[]>([]);
  const [pageNum, setPageNum] = useState<number>(1);
  const [pageSize, setPageSize] = useState<number>(10);
  const [totalItems, setTotalItems] = useState<number>(0);

  useEffect(() => {
    const fetchSessions = async () => {
      try {
        const response = await SessionService.getSession({
          searchCondition: {
            keyword: "",
            course_id: "",
            is_position_order: false,
            is_delete: false
          },
          pageInfo: { pageNum: 1, pageSize: 10 }
        });

        console.log("API Response:", response.data);

        if (!response.data || !response.data.data) {
          console.error("No data received from API");
          return;
        }

        const sessionData = Array.isArray(response.data.data) 
          ? response.data.data as SessionResponse[] 
          : [];

        const validSessions = sessionData.filter(session => session.pageData && session.pageData.course_id);

        const courseResponses = await Promise.all(validSessions.map(() => 
          CourseService.getCourse({
            searchCondition: {
              keyword: "",
              category_id: "",
              status: "active",
              is_delete: false
            },
            pageInfo: { pageNum: 1, pageSize: 10 }
          })
        ));

        const courseMap: Record<string, string> = {};
        courseResponses.forEach(courseResponse => {
          if (courseResponse.data && Array.isArray(courseResponse.data.data.pageData)) {
            courseResponse.data.data.pageData.forEach(course => {
              courseMap[course._id] = course.name;
            });
          }
        });

        const sessionsWithCourseNames = validSessions.map(session => ({
          ...session,
          course_name: courseMap[session.pageData.course_id] || ""
        }));

        setSessions(sessionsWithCourseNames);
        setFilteredSession(sessionsWithCourseNames);
        setTotalItems(response.data.data.pageInfo?.totalItems || sessionsWithCourseNames.length);
      } catch (error) {
        console.error("Error fetching sessions or course names:", error);
      }
    };

    fetchSessions();
  }, []);

  const renderActions = (record: LessonResponse) => (
    <div className="flex space-x-2">
      <EditButton data={record} />
      <DeleteButton />
    </div>
  );

  const handleSearch = (searchText: string) => {
    if (searchText === "") {
      setFilteredSession(sessions);
      setTotalItems(sessions.length);
    } else {
      const filtered = sessions.filter((session) =>
        session.pageData?.name?.toLowerCase().includes(searchText.toLowerCase())
      );
      setFilteredSession(filtered);
      setTotalItems(filtered.length);
    }
    setPageNum(1);
  };

  const mapSessionToLesson = (session: SessionResponse): LessonResponse => {
    if (!session?.pageData) {
      console.error("Invalid session data:", session);
      return {
        pageData: {
          _id: '',
          name: '',
          course_id: '',
          session_id: '',
          position_order: 0,
          created_at: new Date(),
          user_id: '',
          description: '',
          lesson_type: LessonType.TEXT,
          video_url: '',
          image_url: '',
          full_time: 0,
          updated_at: new Date(),
          is_deleted: false,
          course_name: '',
          session_name: '',
          user_name: ''
        },
        pageInfo: {
          pageNum: 1,
          pageSize: 10,
          totalItems: 0,
          totalPages: 0
        }
      };
    }

    return {
      pageData: {
        _id: session.pageData._id || '',
        name: session.pageData.name || '',
        course_id: session.pageData.course_id || '',
        session_id: session.pageData._id || '',
        position_order: session.pageData.position_order || 0,
        created_at: new Date(session.pageData.created_at),
        user_id: session.pageData.user_id || '',
        description: session.pageData.description || '',
        lesson_type: LessonType.TEXT,
        video_url: "",
        image_url: "",
        full_time: 0,
        updated_at: new Date(),
        is_deleted: false,
        course_name: session.pageData.course_id || "",
        session_name: session.pageData.name || "",
        user_name: session.pageData.user_id || ""
      },
      pageInfo: {
        pageNum: 1,
        pageSize: 10,
        totalItems: 0,
        totalPages: 0
      }
    };
  };

  const columns = [
    {
      title: "Name",
      key: "name",
      dataIndex: ["pageData", "name"]
    },
    {
      title: "Course Name", 
      key: "course_name",
      dataIndex: "course_name"
    },
    {
      title: "Created At",
      key: "created_at",
      dataIndex: "created_at",
      render: (text: Date) => formatDate(text)
    },
    {
      title: "Actions",
      key: "actions",
      render: (_: any, record: LessonResponse) => renderActions(record)
    }
  ];

  return (
    <>
      <div className="mb-4 mt-4 flex justify-between">
        <CustomSearch onSearch={handleSearch} placeholder="Search by session name" className="w-1/5" />
        <CreateButton />
      </div>
      <Table 
        columns={columns} 
        dataSource={filteredSession
          .filter(session => session?.pageData)
          .map(mapSessionToLesson)
        } 
        rowKey={(record) => record.pageData._id}
        pagination={false}
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
