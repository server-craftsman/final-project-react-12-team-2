import Table from "antd/es/table";
import { formatDate } from "../../../../utils/helper";
import { useEffect, useState } from "react";
import { Pagination } from "antd";
import CustomSearch from "../../../generic/search/CustomSearch";
import EditButton from "./EditButton";
import DeleteButton from "./DeleteButton";
import CreateButton from "./CreateButton";
import { LessonService } from "../../../../services/lesson/lesson.service";
import { CourseService } from "../../../../services/course/course.service";
import { Lesson } from "../../../../models/api/responsive/lesson/lesson.response.model";

const DisplayLesson = () => {
  const [lessons, setLessons] = useState<Lesson["pageData"]>([]);
  const [filteredLessons, setFilteredLessons] = useState<Lesson["pageData"]>([]);
  const [pageNum, setPageNum] = useState<number>(1);
  const [pageSize, setPageSize] = useState<number>(10);
  const [totalItems, setTotalItems] = useState<number>(0);

  useEffect(() => {
    const fetchLessons = async () => {
      const response = await LessonService.getLesson({ searchCondition: { keyword: "", course_id: "", is_position_order: false, is_delete: false }, pageInfo: { pageNum: 1, pageSize: 10 } });
      const lessonsData = Array.isArray(response.data.data.pageData) ? response.data.data.pageData : [response.data.data.pageData];
      
      // Fetch course details for each lesson
      const lessonsWithCourseDetails = await Promise.all(
        lessonsData.map(async (lesson) => {
          try {
            const courseResponse = await CourseService.getCourseById(lesson.course_id);
            return {
              ...lesson,
              course_name: courseResponse.data.data.name
            };
          } catch (error) {
            console.error(`Error fetching course details for lesson ${lesson._id}:`, error);
            return {
              ...lesson,
              course_name: 'Unknown Course'
            };
          }
        })
      );

      setLessons(lessonsWithCourseDetails);
      setTotalItems(response.data.data.pageInfo.totalItems);
      setFilteredLessons(lessonsWithCourseDetails);
    };
    fetchLessons();
  }, []);

  const renderActions = (record: Lesson["pageData"][0]) => (
    <div className="flex space-x-2">
      <EditButton data={record} />
      <DeleteButton />
    </div>
  );

  const paginatedCourses = () => {
    const startIndex = (pageNum - 1) * pageSize;
    const endIndex = startIndex + pageSize;
    return filteredLessons.slice(startIndex, endIndex);
  };
  const renderMedia = (record: Lesson["pageData"][0]) => {
    if (record.video_url) {
      return (
        <div className="flex items-center justify-center">
          <video 
            width="200" 
            controls
            controlsList="nodownload" 
            className="rounded-md"
            playsInline
            autoPlay
            muted
          >
            <source src={record.video_url} type="video/mp4" />
            <source src={record.video_url} type="video/webm" />
            <track kind="captions" />
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
            loading="lazy"
          />
        </div>
      );
    }
    return null;
  };
  const handleSearch = (searchText: string) => {
    if (searchText === "") {
      setFilteredLessons(lessons);
    } else {
      const filtered = lessons.filter((lesson) =>
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        (lesson as any).name.toLowerCase().includes(searchText.toLowerCase())
      );
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      setFilteredLessons(filtered as any);
    }
    setPageNum(1);
    setTotalItems(filteredLessons.length);
  };
  const columns = [
    {
      title: "Name",
      key: "name",
      dataIndex: "name"
    },
    {
      title: "Course Name",
      key: "course_name",
      dataIndex: "course_name"
    },
    {
      title: "Full Time",
      key: "full_time",
      dataIndex: "full_time"
    },
    {
      title: "Created At",
      key: "created_at",
      dataIndex: "created_at",
      render: (text: Date) => formatDate(text)
    },
    {
      title: "Media",
      key: "video_url",
      dataIndex: "video_url",
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      render: (_: any, record: Lesson["pageData"][0]) => renderMedia(record)
    },
    {
      title: "Actions",
      key: "actions",
      dataIndex: "actions",
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      render: (_: any, record: Lesson["pageData"][0]) => renderActions(record)
    }
  ];
  return (
    <>
      <div className="mb-4 mt-4 flex justify-between">
        <CustomSearch onSearch={handleSearch} placeholder="Search by lesson name" className="w-1/5" />
        <CreateButton />
      </div>
      <Table columns={columns} dataSource={paginatedCourses()} rowKey="id" pagination={false} />
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

export default DisplayLesson;
