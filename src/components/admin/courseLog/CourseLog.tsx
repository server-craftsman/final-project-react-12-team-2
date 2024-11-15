import React, { useEffect, useState } from "react";
import { CourseService } from "../../../services/course/course.service";
import { Button, Modal, Table, message } from "antd";
import { GetCourseResponsePageData } from "../../../models/api/responsive/course/course.response.model";
import { formatDate } from "../../../utils/helper";
import { CourseStatusEnum } from "../../../models/prototype/Course";
import { courseStatusColor } from "../../../utils/courseStatus";
import { CourseLogService } from "../../../services/courselog/courselog.service";
import { CourseLogs } from "../../../models/api/responsive/admin/courselog.responsive";
import LoadingAnimation from "../../../app/UI/LoadingAnimation";
const CourseLog: React.FC<{ searchQuery: string; statusFilter: string }> = ({ searchQuery, statusFilter }) => {
  const [courses, setCourses] = useState<GetCourseResponsePageData[]>([]);
  const [courseLog, setCourseLog] = useState<CourseLogs[]>([]);
  const [isCourseLogModalVisible, setIsCourseLogModalVisible] = useState(false);
  const [courseName, setCourseName] = useState<string>(""); // Biến mới để lưu tên khóa học
  const [pageInfo, setPageInfo] = useState<any>({});

  const defaultParams = {
    pageInfo: {
      pageNum: 1,
      pageSize: 10
    }
  };
  const fetchCourses = async (pageNum: number = defaultParams.pageInfo.pageNum, pageSize: number = defaultParams.pageInfo.pageSize) => {
    try {
        const response = await CourseService.getCourse({
          pageInfo: {
            pageNum,
            pageSize
          },
          searchCondition: {
            keyword: searchQuery || "",
            category_id: "",
            status: statusFilter !== "all" ? statusFilter : "",
            is_delete: false
          }
        });

        if (response && response.data) {
          setCourses(response.data.data.pageData as GetCourseResponsePageData[]);
          setPageInfo(response.data.data.pageInfo);
        }
      } catch (error) {
        message.error("Error loading course log");
        console.error("Error fetching courses:", error);
      }
    };

  useEffect(() => {
    fetchCourses();
  }, [searchQuery, statusFilter]);
  console.log("aaaa", courses);

  // Cập nhật hàm handleShowModal để nhận thêm tham số courseName
  const handleShowModal = async (courseId: string) => {
    try {
      setCourseName(courseName);
      const response = await CourseLogService.getCourseLog({
        searchCondition: {
          course_id: courseId,
          keyword: "",
          category_id: "",
          status: "",
          is_delete: false
        },
        pageInfo: { pageNum: 1, pageSize: 10 }
      });

      if (response && response.data) {
        const courseLogData = response.data.data.pageData as CourseLogs[];
        setCourseLog(courseLogData); // Cập nhật course log vào state
        setIsCourseLogModalVisible(true);
      }
    } catch (error) {
      message.error("Error loading course log");
      console.error("Error fetching course logs:", error);
    }
  };
  console.log("bbbbb", courseLog);
  const columns = [
    {
      title: "Course Name",
      dataIndex: "name",
      key: "name",
      render: (name: string, record: GetCourseResponsePageData) => <a onClick={() => handleShowModal(record._id)}>{name}</a>
    },
    {
      title: "Status",
      dataIndex: "status",
      key: "status",
      render: (status: CourseStatusEnum) => <span className={`text-sm capitalize ${courseStatusColor[status]}`}>{status}</span>
    },
    {
      title: "Created At",
      dataIndex: "created_at",
      key: "created_at",
      render: (created_at: Date) => formatDate(created_at)
    }
  ];

  if (courses && courses.length > 0) {
    return (
      <>
      <Table 
      columns={columns} 
      dataSource={courses} 
      rowKey={(record) => record._id} 
      pagination={{
        current: pageInfo.pageNum,
        pageSize: pageInfo.pageSize,
        total: pageInfo.totalItems,
        showTotal: (total, range) => `${range[0]}-${range[1]} of ${total} items`,
        onChange: (page, pageSize) => {
          fetchCourses(page, pageSize);
        },
        showSizeChanger: true,
        className: "bg-pagination",
        position: ["bottomLeft"]
      }}
      />

      <Modal
        width={1000}
        title={`View Course Log Details - ${courseName}`} // Hiển thị tên khóa học trên Modal
        open={isCourseLogModalVisible}
        onCancel={() => setIsCourseLogModalVisible(false)}
        footer={[
          <Button key="close" onClick={() => setIsCourseLogModalVisible(false)}>
            Close
          </Button>
        ]}
      >
        <Table
          columns={[
            {
              title: "Course Name",
              dataIndex: "course_name",
              key: "course_name"
            },
            {
              title: "Old Status",
              dataIndex: "old_status",
              key: "old_status",
              render: (status: CourseStatusEnum) => <span className={`text-sm capitalize ${courseStatusColor[status]}`}>{status}</span>
            },
            {
              title: "New Status",
              dataIndex: "new_status",
              key: "new_status",
              render: (status: CourseStatusEnum) => <span className={`text-sm capitalize ${courseStatusColor[status]}`}>{status}</span>
            },
            {
              title: "Created At",
              dataIndex: "created_at",
              key: "created_at",
              render: (created_at: Date) => formatDate(created_at)
            }
          ]}
          dataSource={courseLog}
          rowKey={(record) => record._id}
        />
      </Modal>
      </>
    );
  } else {
    return <LoadingAnimation />;
  }
};

export default CourseLog;
