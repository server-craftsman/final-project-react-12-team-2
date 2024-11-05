import Table from "antd/es/table";
import { formatDate } from "../../../../utils/helper";
import { useCallback, useEffect, useState } from "react";
import { Pagination, Button } from "antd";
import { EditOutlined } from "@ant-design/icons";
import CustomSearch from "../../../generic/search/CustomSearch";
import EditButton from "./EditButton";
import DeleteButton from "./DeleteButton";
import CreateButton from "./CreateButton";
import { LessonService } from "../../../../services/lesson/lesson.service";
import { Lesson } from "../../../../models/api/responsive/lesson/lesson.response.model";

const DisplayLesson = ({ refreshKey }: { refreshKey: number }) => {
  const [lessons, setLessons] = useState<Lesson["pageData"]>([]);
  const [filteredLessons, setFilteredLessons] = useState<Lesson["pageData"]>([]);
  const [pageNum, setPageNum] = useState<number>(1);
  const [pageSize, setPageSize] = useState<number>(10);
  const [totalItems, setTotalItems] = useState<number>(0);
  const [selectedLesson, setSelectedLesson] = useState<Lesson["pageData"][0] | null>(null);
  const [isEditModalOpen, setIsEditModalOpen] = useState<boolean>(false);

  const fetchLessons = useCallback(async () => {
    const response = await LessonService.getLesson({
      searchCondition: {
        keyword: "",
        course_id: "",
        is_delete: false,
        is_position_order: false
      },
      pageInfo: { pageNum: 1, pageSize: 100 }
    });
    if (response.data) {
      const lessonData = Array.isArray(response.data.data.pageData) ? response.data.data.pageData : [response.data.data.pageData];
      setLessons(lessonData);
      setFilteredLessons(lessonData);
      setTotalItems(lessonData.length);
    }
  }, []);

  useEffect(() => {
    fetchLessons();
  }, [fetchLessons, refreshKey]);
  
  const handleEditClick = async (lessonId: string) => {
    try {
      const response = await LessonService.getLessonDetails(lessonId);
      if (response?.data) {
        const lessonDetails = response.data.data;
        const lesson = {
          ...lessonDetails,
          // course_id: lessonDetails.course_id || "",
          // session_id: lessonDetails.session_id || ""
        } as any;
        if (lesson) {
          console.log("Selected Lesson:", lesson);
          setSelectedLesson(lesson);
          setIsEditModalOpen(true);
        }
      }
    } catch (error) {
      console.error("Failed to fetch lesson details", error);
    }
  };

  const paginatedCourses = () => {
    const startIndex = (pageNum - 1) * pageSize;
    const endIndex = startIndex + pageSize;
    return filteredLessons.slice(startIndex, endIndex);
  };

  const renderMedia = (record: Lesson["pageData"][0]) => {
    if (record.video_url) {
      return (
        <div className="flex items-center justify-center">
          <video width="200" controls controlsList="nodownload" className="rounded-md" playsInline autoPlay muted>
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
          <img src={record.image_url} alt="lesson media" width="200" className="rounded-md" loading="lazy" />
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
        (lesson as any).name.toLowerCase().includes(searchText.toLowerCase())
      );
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
      render: (_: any, record: Lesson["pageData"][0]) => renderMedia(record)
    },
    {
      title: "Actions",
      key: "actions",
      dataIndex: "actions",
      render: (_: any, record: Lesson["pageData"][0]) => (
        <div className="flex space-x-2">
          <Button icon={<EditOutlined />} onClick={() => handleEditClick(record._id)} />
          <DeleteButton lessonId={record._id} onDeleteSuccess={handleLessonCreated} />
        </div>
      )
    }
  ];

  const handleLessonCreated = useCallback(async () => {
    setPageNum(1);
    fetchLessons();
  }, [fetchLessons]);

  return (
    <>
      <div className="mb-4 mt-4 flex justify-between">
        <CustomSearch onSearch={handleSearch} placeholder="Search by lesson name" className="w-1/5" />
        <CreateButton onLessonCreated={handleLessonCreated} />
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
          className="bg-pagination"
        />
      </div>
      {selectedLesson && (
        <EditButton 
          data={selectedLesson} 
          isOpen={isEditModalOpen} 
          onClose={() => setIsEditModalOpen(false)} 
          onLessonCreated={handleLessonCreated} 
        />
      )}
    </>
  );
};

export default DisplayLesson;
