import Table from "antd/es/table";
import { formatDate } from "../../../../utils/helper";
import { useEffect, useState } from "react";
import { message, Pagination } from "antd";
import CustomSearch from "../../../generic/search/CustomSearch";
import { courses } from "../../../../data/courses.json";
import { sessions as sessionsData } from "../../../../data/sessions.json";
import { Lesson } from "../../../../models/Lesson";
import EditButton from "./EditButton";
import DeleteButton from "./DeleteButton";

const DisplaySession = () => {
  const [sessions, setSessions] = useState<[]>([]);
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
    return sessions.slice(startIndex, endIndex);
  };
  const renderMedia = (record: Lesson) => {
    if (record.video_url) {
      return (
        <div className="flex items-center justify-center">
          <video width="200" controls className="rounded-md">
            <source src={record.video_url} type="video/mp4" />
            Your browser does not support the video tag.
          </video>
        </div>
      );
    } else if (record.image_url) {
      return (
        <div className="flex items-center justify-center">
          <img
            src={record.image_url}
            alt="lesson media"
            width="200"
            className="rounded-md"
          />
        </div>
      );
    }
    return null;
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
      render: (_, record: Lesson) => renderActions(record),
    },
  ];
  return (
    <>
      <div className="mb-4 mt-4 w-1/5">
        <CustomSearch
          onSearch={() => message.loading("seaching")}
          placeholder="Search by session name"
        />
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
