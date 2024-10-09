/* eslint-disable @typescript-eslint/no-explicit-any */
import { Table, Typography } from 'antd';
import { getOrderStatus } from '../../../utils/helper';
import {courses} from '../../../data/courses.json';

// Data for recent orders
// Data for recent courses
const recentCourseData = courses.map((course) => ({
    id: course.id,
    name: course.name,
    category: course.category_id,
    user: course.user_id,
    description: course.description,
    price: course.price,
    discount: course.discount,
    status: course.status,
    createdAt: new Date(course.created_at).toLocaleDateString(),
}));


// Define table columns
const columns = [
    {
      title: 'ID',
      dataIndex: 'id',
      key: 'id',
      render: (text: any) => `#${text}`,
    },
    {
      title: 'Course Name',
      dataIndex: 'name',
      key: 'name',
    },
    {
      title: 'Category ID',
      dataIndex: 'category',
      key: 'category',
    },
    {
      title: 'User ID',
      dataIndex: 'user',
      key: 'user',
    },
    {
      title: 'Price',
      dataIndex: 'price',
      key: 'price',
      render: (price: any) => `$${price.toFixed(2)}`,
    },
    {
      title: 'Discount',
      dataIndex: 'discount',
      key: 'discount',
      render: (discount: any) => `${discount}%`,
    },
    {
      title: 'Status',
      dataIndex: 'status',
      key: 'status',
        render:(status: any) => getOrderStatus(status),
    },
    {
      title: 'Created At',
      dataIndex: 'createdAt',
      key: 'createdAt',
      
    },
  ];
  


const RecentCourses = () => {
    return (
      <div className='bg-white px-4 pt-3 pb-4 rounded-sm border border-gray-200 flex-1'>
        <Typography.Text strong className="text-gray-700">Recent Courses</Typography.Text>
        <div className="mt-3">
          <Table
            columns={columns}
            dataSource={recentCourseData}
            rowKey="id"
            pagination={false}
          />
        </div>
      </div>
    );
  };
  
  export default RecentCourses;
  
