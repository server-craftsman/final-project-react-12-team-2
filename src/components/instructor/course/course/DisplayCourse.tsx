import Table, { ColumnsType } from "antd/es/table";
import { courseStatusColor } from "../../../../utils/courseStatus";
import { formatDate, moneyFormat } from "../../../../utils/helper";
import { Course, CourseStatusEnum } from "../../../../models/prototype/Course";
import { useEffect, useState } from "react";
import { Button, message, Modal, Pagination, Select } from "antd";
import CustomSearch from "../../../generic/search/CustomSearch";
import { courses as coursesData } from "../../../../data/courses.json";
import { categories } from "../../../../data/categories.json";
import EditButton from "./EditButton";
import DeleteButton from "./DeleteButton";
import CreateCourseButton from "./CreateButton";
import FilterStatus from "./FilterStatus";
import {
  capitalizeWords,
  courseStatusName,
} from "../../../../const/constCommon";
const { Option } = Select;

const DisplayCourse: React.FC<{
  searchTerm: string;
  statusFilter: CourseStatusEnum | "";
  onSearch: (value: string) => void;
  onStatusChange: (status: CourseStatusEnum | "") => void;
}> = ({ searchTerm, statusFilter, onSearch, onStatusChange }) => {
  const [courses, setCourses] = useState<Course[]>([]);
  const [filteredCourses, setFilteredCourses] = useState<Course[]>([]);
  const [pageNum, setPageNum] = useState<number>(1);
  const [pageSize, setPageSize] = useState<number>(10);
  const [totalItems, setTotalItems] = useState<number>(0);
  const [selectedRowKeys, setSelectedRowKeys] = useState<number[]>([]);
  const [selectedCourse, setSelectedCourse] = useState([]);
  const [isModalVisible, setIsModalVisible] = useState(false);

  useEffect(() => {
    const coursesTempData = coursesData.map((course) => {
      const category = categories.find(
        (category) => category.id === course.category_id,
      );
      return {
        ...course,
        category_name: category?.name,
      };
    }) as unknown as [];
    setCourses(coursesTempData);
    setTotalItems(coursesTempData.length);
    setFilteredCourses(coursesTempData);
  }, [statusFilter]); // Add statusFilter as a dependency

  const renderStatusChange = (record: Course) => {
    const isWaitingApprove = [
      CourseStatusEnum.new,
      CourseStatusEnum.waiting_approve,
    ].includes(record.status);
    const isReject = [CourseStatusEnum.reject].includes(record.status);
    return isWaitingApprove && !isReject ? (
      <Button
        type="primary"
        onClick={() =>
          message.info("Click here Send to admin to send to admin for approval")
        }
      >
        Waiting approval
      </Button>
    ) : isReject ? (
      <Button
        danger
        type="dashed"
        className="w-[140px]"
        onClick={() => message.error("This course is rejected")}
      >
        Rejected
      </Button>
    ) : (
      <Select
        defaultValue={capitalizeWords(record.status)}
        style={{ width: 140 }}
      >
        <Option value="active">Active</Option>
        <Option value="inactive">Inactive</Option>
      </Select>
    );
  };
  const renderActions = (record: Course) => (
    <div className="flex space-x-2">
      <EditButton data={record} />
      <DeleteButton />
    </div>
  );
  const getCourseStatusName = (status: CourseStatusEnum): string => {
    return courseStatusName[status] || "Unknown status";
  };
  useEffect(() => {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    setSelectedCourse(selectedRowKeys as unknown as any);
  }, [selectedRowKeys, setSelectedCourse]);

  const filteredCoursesData = courses.filter(
    (course) =>
      course.name.toLowerCase().includes(searchTerm.toLowerCase()) &&
      (statusFilter === "" || course.status === statusFilter),
  );

  const paginatedCourses = () => {
    const startIndex = (pageNum - 1) * pageSize;
    const endIndex = startIndex + pageSize;
    return filteredCoursesData.slice(startIndex, endIndex); // Use filteredCoursesData
  };
  const handleSearch = (searchText: string) => {
    if (searchText === "") {
      setFilteredCourses(courses);
    } else {
      const filtered = courses.filter((course) =>
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        (course as any).name.toLowerCase().includes(searchText.toLowerCase()),
      );
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      setFilteredCourses(filtered as any);
    }
    setPageNum(1);
    setTotalItems(filteredCourses.length);
  };
  const columns: ColumnsType<Course> = [
    {
      title: "Name",
      key: "name",
      dataIndex: "name",
    },
    {
      title: "Category Name",
      key: "category_name",
      dataIndex: "category_name",
    },
    {
      title: "Status",
      key: "status",
      dataIndex: "status",
      render: (status: CourseStatusEnum) => (
        <button className={courseStatusColor[status]}>
          {getCourseStatusName(status)}
        </button>
      ),
    },
    {
      title: "Price",
      key: "price",
      dataIndex: "price",
      render: (price: number) => moneyFormat(price),
    },
    {
      title: "Discount",
      key: "discount",
      dataIndex: "discount",
    },
    {
      title: "Created At",
      key: "created_at",
      dataIndex: "created_at",
      render: (text: Date) => formatDate(text),
    },
    {
      title: "Change Status",
      key: "change_status",
      dataIndex: "change_status",
      render: (_, record) => renderStatusChange(record),
    },
    {
      title: "Actions",
      key: "actions",
      dataIndex: "actions",
      render: (_, record) => renderActions(record),
    },
  ];
  const rowSelection = {
    selectedRowKeys,
    onChange: (selectedRowKeys: React.Key[]) => {
      setSelectedRowKeys(selectedRowKeys as number[]);
    },
  };

  const showModal = () => {
    setIsModalVisible(true);
  };

  const handleOk = () => {
    setIsModalVisible(false);
    message.info("Sending to admin");
  };

  const handleCancel = () => {
    setIsModalVisible(false);
  };

  return (
    <>
      <div className="mb-4 mt-4 flex justify-between">
        <CustomSearch
          onSearch={(value) => {
            handleSearch(value);
            onSearch(value); // Use the onSearch prop here
          }}
          placeholder="Search by course name"
          className="w-1/5"
        />
        <FilterStatus onStatusChange={onStatusChange} />
        <div className="flex justify-end gap-2">
          <CreateCourseButton />
          <Button disabled={selectedCourse.length === 0} onClick={showModal}>
            Send to Admin
          </Button>
        </div>
      </div>
      <Table
        rowSelection={rowSelection}
        columns={columns}
        dataSource={filteredCoursesData && paginatedCourses()}
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
      <Modal
        title="Confirm"
        open={isModalVisible}
        onOk={handleOk}
        onCancel={handleCancel}
        okText="Yes"
        cancelText="No"
      >
        <p>Are you sure you want to send the selected courses to admin?</p>
      </Modal>
    </>
  );
};

export default DisplayCourse;
