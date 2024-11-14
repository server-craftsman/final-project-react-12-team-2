import { formatDate } from "../../../utils/helper";
import { useEffect, useState } from "react";
import { Button, Table } from "antd";
import { EyeOutlined } from "@ant-design/icons";
// import CustomSearch from "../../generic/search/CustomSearch";
import { LessonService } from "../../../services/lesson/lesson.service";
import { Lesson } from "../../../models/api/responsive/lesson/lesson.response.model";
import ModalLessonDetail from "./ModalLessonDetail";
import { useLessonStore } from "../../../hooks/useCallback";

interface LessonManagementProps {
  searchTerm: string;
  activeKey: string;
}

const LessonManagement: React.FC<LessonManagementProps> = ({ searchTerm, activeKey }) => {
  const [filteredLessons, setFilteredLessons] = useState<Lesson["pageData"]>([]);
  const [totalItems, setTotalItems] = useState<number>(0);
  const [pagination, setPagination] = useState({ current: 1, pageSize: 10 });
  const refreshLessons = useLessonStore((state) => state.refreshLessons);
  const [selectedLessonDetail, setSelectedLessonDetail] = useState<Lesson["pageData"][0] | null>(null);
  const [isLessonDetailModalVisible, setIsLessonDetailModalVisible] = useState(false);

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
        pageInfo: { pageNum: pagination.current, pageSize: pagination.pageSize }
      });
      if (response.data) {
        const lessonData = Array.isArray(response.data.data.pageData) ? response.data.data.pageData : [response.data.data.pageData];
        setFilteredLessons(lessonData);
        setTotalItems(response.data.data.pageInfo.totalItems);
      }
    };
    fetchLessons();
  }, [refreshLessons, searchTerm, activeKey, pagination]);

  const showLessonDetailModal = async (lessonId: string) => {
    try {
      const response = await LessonService.getLessonDetails(lessonId);
      setSelectedLessonDetail(response.data.data);
      setIsLessonDetailModalVisible(true);
    } catch (error) {
      console.error("Failed to fetch lesson details", error);
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
      title: "Action",
      key: "action",
      dataIndex: "action",
      render: (_: any, record: Lesson["pageData"][0]) => (
        <div className="flex space-x-3">
          <Button icon={<EyeOutlined />} onClick={() => showLessonDetailModal(record._id)} className="bg-gradient-tone text-white" />
        </div>
      ) 
    }
  ];

  return (
    <>
      <Table 
      columns={columns} 
      dataSource={filteredLessons} 
        rowKey="id"
        pagination={{
          current: pagination.current,
          pageSize: pagination.pageSize,
          total: totalItems,
          showTotal: (total, range) => `${range[0]}-${range[1]} of ${total} items`,
          onChange: (page, pageSize) => {
            setPagination({ current: page, pageSize });
          },
          showSizeChanger: true,
          className: "bg-pagination",
          position: ["bottomLeft"]
        }}
      />
      {/* <div className="mt-5 flex justify-start">
        <Pagination
          current={pagination.current}
          pageSize={pagination.pageSize}
          total={totalItems}
          showTotal={(total, range) => `${range[0]}-${range[1]} of ${total} items`}
          onChange={(page, pageSize) => {
            setPagination({ current: page, pageSize });
          }}
          showSizeChanger
          className="bg-pagination"
        />
      </div> */}
      {selectedLessonDetail && (
        <ModalLessonDetail 
          lessonDetail={selectedLessonDetail} 
          visible={isLessonDetailModalVisible} 
          onClose={() => setIsLessonDetailModalVisible(false)} 
      />
      )}
    </>
  );
};

export default LessonManagement;
