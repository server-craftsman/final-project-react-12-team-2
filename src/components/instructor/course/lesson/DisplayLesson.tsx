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
      pageInfo: { pageNum, pageSize }
    });
    if (response.data) {
      const lessonData = Array.isArray(response.data.data.pageData) ? response.data.data.pageData : [response.data.data.pageData];
      setFilteredLessons(lessonData);
      setTotalItems(response.data.data.pageInfo.totalItems);
    }
  }, [pageNum, pageSize]);

  useEffect(() => {
    fetchLessons();
  }, [fetchLessons, refreshKey]);

  const handleEditClick = async (lessonId: string) => {
    try {
      const response = await LessonService.getLessonDetails(lessonId);
      if (response?.data) {
        const lessonDetails = response.data.data;
        const lesson = {
          ...lessonDetails
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

  const handleSearch = async (searchText: string) => {
    setPageNum(1);
    const response = await LessonService.getLesson({
      searchCondition: {
        keyword: searchText,
        course_id: "",
        is_delete: false,
        is_position_order: false
      },
      pageInfo: { pageNum: 1, pageSize }
    });
    if (response.data) {
      const lessonData = Array.isArray(response.data.data.pageData) ? response.data.data.pageData : [response.data.data.pageData];
      setFilteredLessons(lessonData);
      setTotalItems(response.data.data.pageInfo.totalItems);
    }
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
      title: "Lesson Type",
      key: "lesson_type",
      dataIndex: "lesson_type"
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
      <Table columns={columns} dataSource={filteredLessons} rowKey="id" pagination={false} />
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
      {selectedLesson && <EditButton data={selectedLesson} isOpen={isEditModalOpen} onClose={() => setIsEditModalOpen(false)} onLessonCreated={handleLessonCreated} />}
    </>
  );
};

export default DisplayLesson;
