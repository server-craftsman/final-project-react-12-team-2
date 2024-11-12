import Table from "antd/es/table";
import { formatDate } from "../../../utils/helper";
import { useEffect, useState } from "react";
import { Pagination } from "antd";
// import CustomSearch from "../../generic/search/CustomSearch";
import { LessonService } from "../../../services/lesson/lesson.service";
import { Lesson } from "../../../models/api/responsive/lesson/lesson.response.model";
import { useLessonStore } from "../../../hooks/useCallback";

interface LessonManagementProps {
  searchTerm: string;
  activeKey: string;
}

const LessonManagement: React.FC<LessonManagementProps> = ({ searchTerm, activeKey }) => {
  const [filteredLessons, setFilteredLessons] = useState<Lesson["pageData"]>([]);
  const [pageNum, setPageNum] = useState<number>(1);
  const [pageSize, setPageSize] = useState<number>(10);
  const [totalItems, setTotalItems] = useState<number>(0);
  const refreshLessons = useLessonStore((state) => state.refreshLessons);

  useEffect(() => {
    refreshLessons();
    const fetchLessons = async () => {
      const response = await LessonService.getLesson({
        searchCondition: {
          keyword: searchTerm,
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
    };
    fetchLessons();
  }, [refreshLessons, searchTerm, activeKey, pageNum, pageSize]);

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
    }
  ];

  return (
    <>
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
    </>
  );
};

export default LessonManagement;
