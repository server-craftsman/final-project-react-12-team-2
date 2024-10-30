import { useEffect, useState } from "react";
import Table from "antd/es/table";
import { Pagination } from "antd";
import CustomSearch from "../../../generic/search/CustomSearch";
// import { Lesson, LessonType } from "../../../../models/prototype/Lesson";
import EditButton from "./EditButton";
import DeleteButton from "./DeleteButton";
import CreateButton from "./CreateButton";
import { SessionService } from "../../../../services/session/session.service";
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
    // Fetch sessions from the API
    SessionService.getSession({
      searchCondition: {
        keyword: "",
        course_id: "",
        is_position_order: false,
        is_delete: false
      },
      pageInfo: { pageNum: 1, pageSize: 10 }
    })
      .then(response => {
        const sessionData = Array.isArray(response.data.data.pageData)
          ? response.data.data.pageData
          : [response.data.data.pageData]; // Ensure sessionData is an array
        setSessions(sessionData as SessionResponse[]);
        setFilteredSession(sessionData as SessionResponse[]);
        setTotalItems(response.data.data.pageInfo.totalItems);
      })
      .catch(error => {
        console.error("Error fetching sessions:", error);
      });
  }, []);

  const renderActions = (record: LessonResponse) => (
    <div className="flex space-x-2">
      <EditButton data={record} />
      <DeleteButton />
    </div>
  );

  // const paginatedCourses = () => {
  //   const startIndex = (pageNum - 1) * pageSize;
  //   const endIndex = startIndex + pageSize;
  //   return filteredSession.slice(startIndex, endIndex).map(session => ({
  //     id: session.pageData._id,
  //     name: session.pageData.name,
  //     position_order: session.pageData.position_order,
  //     created_at: session.pageData.created_at,
  //     user_id: session.pageData.user_id,
  //     description: session.pageData.description,
  //     course_id: session.pageData.course_id,
  //     session_id: session.pageData._id,
  //     lesson_type: "",
  //     video_url: "",
  //     image_url: "",
  //   }));
  // };

  const handleSearch = (searchText: string) => {
    if (searchText === "") {
      setFilteredSession(sessions);
      setTotalItems(sessions.length);
    } else {
      const filtered = sessions.filter((session) =>
        session.pageData.name.toLowerCase().includes(searchText.toLowerCase())
      );
      setFilteredSession(filtered);
      setTotalItems(filtered.length);
    }
    setPageNum(1);
  };

  const mapSessionToLesson = (session: SessionResponse): LessonResponse => ({
    pageData: {
      _id: session.pageData._id,
      name: session.pageData.name,
      course_id: session.pageData.course_id,
      session_id: session.pageData._id,
      position_order: session.pageData.position_order,
      created_at: new Date(session.pageData.created_at),
      user_id: session.pageData.user_id,
      description: session.pageData.description,
      lesson_type: LessonType.TEXT,
      video_url: "",
      image_url: "",
      full_time: 0,
      updated_at: new Date(),
      is_deleted: false,
      course_name: "",
      session_name: "",
      user_name: ""
    },
    pageInfo: {
      pageNum: 1,
      pageSize: 10,
      totalItems: 0,
      totalPages: 0
    }
  });

  const columns = [
    {
      title: "Name",
      key: "name",
      dataIndex: "name"
    },
    {
      title: "Course Name",
      key: "course_name",
      dataIndex: "course_id"
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
      dataIndex: "actions",
      render: (_: any, record: LessonResponse) => renderActions(record)
    }
  ];

  return (
    <>
      <div className="mb-4 mt-4 flex justify-between">
        <CustomSearch onSearch={handleSearch} placeholder="Search by session name" className="w-1/5" />
        <CreateButton />
      </div>
      {/* <Table columns={columns} dataSource={paginatedCourses()} rowKey="id" pagination={false} /> */}
      <Table 
        columns={columns} 
        dataSource={filteredSession.map(mapSessionToLesson)} 
        rowKey="id" 
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
