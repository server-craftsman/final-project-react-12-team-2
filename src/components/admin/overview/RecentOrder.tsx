import { Table, Typography } from "antd";
import { CourseStatusBadge } from "../../../utils/courseStatus";
import { courses } from "../../../data/courses.json";
import { formatDate } from "../../../utils/helper";
import { StatusType } from "../../../app/enums/course.status.enum";

const recentOrderData = courses.map((course) => ({
  id: course.id,
  name: course.name,
  category: course.category_id,
  user: course.user_id,
  description: course.description,
  price: course.price,
  discount: course.discount,
  status: course.status,
  createdAt: formatDate(new Date(course.created_at))
}));

const columns = [
  {
    title: "ID",
    dataIndex: "id",
    key: "id",
    render: (text: string) => `#${text}`
  },
  {
    title: "Course Name",
    dataIndex: "name",
    key: "name"
  },
  {
    title: "Category ID",
    dataIndex: "category",
    key: "category"
  },
  {
    title: "User ID",
    dataIndex: "user",
    key: "user"
  },
  {
    title: "Price",
    dataIndex: "price",
    key: "price",
    render: (price: number) => `$${price.toFixed(2)}`
  },
  {
    title: "Discount",
    dataIndex: "discount",
    key: "discount",
    render: (discount: string) => `${discount}%`
  },
  {
    title: "Status",
    dataIndex: "status",
    key: "status",
    render: (status: StatusType) => <CourseStatusBadge status={status} />
  },
  {
    title: "Created At",
    dataIndex: "createdAt",
    key: "createdAt"
  }
];

const RecentOrder = () => {
  return (
    <div className="flex-1 rounded-sm border border-gray-200 bg-white px-4 pb-4 pt-3">
      <Typography.Text strong className="text-gray-700">
        Recent Orders
      </Typography.Text>
      <div className="mt-3">
        <Table columns={columns} dataSource={recentOrderData} rowKey="id" pagination={false} />
      </div>
    </div>
  );
};

export default RecentOrder;
