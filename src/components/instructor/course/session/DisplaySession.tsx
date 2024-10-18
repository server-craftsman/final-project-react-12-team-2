import Table from "antd/es/table";
import { formatDate } from "../../../../utils/helper";
import { useEffect, useState } from "react";
import { Pagination } from "antd";
import CustomSearch from "../../../generic/search/CustomSearch";
import { courses } from "../../../../data/courses.json";
import { sessions as sessionsData } from "../../../../data/sessions.json";
import { Lesson } from "../../../../models/Lesson";
import EditButton from "./EditButton";
import DeleteButton from "./DeleteButton";
import CreateButton from "./CreateButton";

const DisplaySession = () => {
  const [sessions, setSessions] = useState<[]>([]);
  const [filteredSession, setFilteredSession] = useState<[]>([]);
  const [pageNum, setPageNum] = useState<number>(1);
  const [pageSize, setPageSize] = useState<number>(10);
  const [totalItems, setTotalItems] = useState<number>(0);

  useEffect(() => {
    const sessionTempData = sessionsData.map((session) => {
      const course = courses.find((course) => course.id === session.course_id);
      return {
        ...session,
        course_name: course?.name,
      };
    }) as unknown as [];
    setSessions(sessionTempData);
    setFilteredSession(sessionTempData);
    setTotalItems(sessionTempData.length);
  }, []);

  const renderActions = (record: Lesson) => (
    <div className="flex space-x-2">
      <EditButton data={record} />
      <DeleteButton />
    </div>
  );

  const paginatedCourses = () => {
    const startIndex = (pageNum - 1) * pageSize;
    const endIndex = startIndex + pageSize;
    return filteredSession.slice(startIndex, endIndex);
  };
  const handleSearch = (searchText: string) => {
    if (searchText === "") {
      setFilteredSession(sessions);
    } else {
      const filtered = courses.filter((course) =>
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        (course as any).name.toLowerCase().includes(searchText.toLowerCase()),
      );
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      setFilteredSession(filtered as any);
    }
    setPageNum(1);
    setTotalItems(filteredSession.length);
  };
  const columns = [
    {
      title: "Name",
      key: "name",
      dataIndex: "name",
    },
    {
      title: "Course Name",
      key: "course_name",
      dataIndex: "course_name",
    },
    {
      title: "Created At",
      key: "created_at",
      dataIndex: "created_at",
      render: (text: Date) => formatDate(text),
    },
    {
      title: "Actions",
      key: "actions",
      dataIndex: "actions",
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      render: (_ : any, record: Lesson) => renderActions(record),
    },
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
        columns={columns}
        dataSource={paginatedCourses()}
        rowKey="id"
        pagination={false}
      />
      <div className="mt-5 flex justify-end">
        <Pagination
          current={pageNum}
          pageSize={pageSize}
          total={totalItems}
          showTotal={(total, range) =>
            `${range[0]}-${range[1]} of ${total} items`
          }
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
