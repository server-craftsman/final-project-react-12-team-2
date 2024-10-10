import { useEffect, useState } from 'react';
import { Table } from 'antd';
import { formatDate } from '../../../utils/helper'; // Import the formatDate function

// Import JSON data
import carts from '../../../data/carts.json';
import courses from '../../../data/courses.json';
import users from '../../../data/users.json';

// Define the columns for the table
const columns = [
  {
    title: 'Course Name',
    dataIndex: 'courseName',
    key: 'courseName',
  },
  {
    title: 'Created At',
    dataIndex: 'createdAt',
    key: 'createdAt',
  },
  {
    title: 'Student Name',
    dataIndex: 'studentName',
    key: 'studentName',
  },
  {
    title: 'Instructor Name',
    dataIndex: 'instructorName',
    key: 'instructorName',
  },
  {
    title: 'Price Paid',
    dataIndex: 'pricePaid',
    key: 'pricePaid',
  },
  {
    title: 'Discount',
    dataIndex: 'discount',
    key: 'discount',
  },
];

const WaitingPaid = () => {
    const [data, setData] = useState([]);

    useEffect(() => {
      // Simulate data fetching and joining
      const completedOrders = carts
        .filter((cart: any) => cart.status === 'waiting_paid' && !cart.is_deleted)
        .map((cart: any) => {
          const course = courses.courses.find((course: any) => course.id === cart?.course_id);
          const student = users.users.find((user: any) => user.id === cart?.student_id);
          const instructor = users.users.find((user: any) => user.id === course?.user_id);
  
          return {
            key: cart.id,
            courseName: course?.name,
            createdAt: formatDate(new Date(cart.created_at)), // Format the date
            studentName: student ? student.name : 'Unknown Student',
            instructorName: instructor ? instructor.name : 'Unknown Instructor',
            pricePaid: `$${cart.price_paid}`,
            discount: `${cart.discount}%`,
          };
        });
  
      setData(completedOrders as any);
    }, []);
  
    return (
      <div>
        <Table columns={columns} dataSource={data} />
      </div>
    );
  }

export default WaitingPaid
