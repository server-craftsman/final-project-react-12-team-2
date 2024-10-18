import Table, { ColumnsType } from "antd/es/table";
import { courseStatusColor } from "../../../../utils/courseStatus";
import { formatDate, moneyFormat } from "../../../../utils/helper";
import { Course, CourseStatusEnum } from "../../../../models/Course";
import { useEffect, useState } from "react";
import { Button, message, Pagination, Select } from "antd";
import CustomSearch from "../../../generic/search/CustomSearch";
import { courses as coursesData } from "../../../../data/courses.json";
import { categories } from "../../../../data/categories.json";
import EditButton from "./EditButton";
import DeleteButton from "./DeleteButton";
const { Option } = Select;
interface DisplayProps {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  setSelectedCourse: any;
}
const DisplayCourse: React.FC<DisplayProps> = ({ setSelectedCourse }) => {
  const [courses, setCourses] = useState<[]>([]);
  const [pageNum, setPageNum] = useState<number>(1);
  const [pageSize, setPageSize] = useState<number>(10);
  const [totalItems, setTotalItems] = useState<number>(0);
  const [selectedRowKeys, setSelectedRowKeys] = useState<number[]>([]);

  const renderStatusChange = (record: Course) => {
    const isWaitingApprove = ["new", "waiting_approve"].includes(record.status);

    return isWaitingApprove ? (
      <Button
        type="primary"
        onClick={() =>
          message.info("Click here Send to admin to send to admin for approval")
        }
      >
        Waiting approval
      </Button>
    ) : (
      <Select defaultValue={record.status} style={{ width: 140 }}>
        <Option value="active">Active</Option>
        <Option value="inactive">Inactive</Option>
      </Select>
    );
  };
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
  }, []);

  const renderActions = (record: Course) => (
    <div className="flex space-x-2">
      <EditButton data={record} />
      <DeleteButton  />
    </div>
  );

  useEffect(() => {
    setSelectedCourse(selectedRowKeys);
  }, [selectedRowKeys, setSelectedCourse]);

  const paginatedCourses = () => {
    const startIndex = (pageNum - 1) * pageSize;
    const endIndex = startIndex + pageSize;
    return courses.slice(startIndex, endIndex);
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
        <button className={courseStatusColor(status)}>{status}</button>
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
  return (
    <>
      <div className="mb-4 mt-4 w-1/5">
        <CustomSearch
          onSearch={() => message.loading("seaching")}
          placeholder="Search by course name"
        />
      </div>
      <Table
        rowSelection={rowSelection}
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

export default DisplayCourse;
