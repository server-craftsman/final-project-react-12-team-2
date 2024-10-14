import { useEffect, useState } from "react";
import { Table } from "antd";
import { formatDate } from "../../../utils/helper"; // Import the formatDate function

// Import JSON data
import purchases from "../../../data/purchases.json";
import carts from "../../../data/carts.json";
import courses from "../../../data/courses.json";
import users from "../../../data/users.json";

// Define the columns for the table
const columns = [
  {
    title: "Course Name",
    dataIndex: "courseName",
    key: "courseName",
  },
  {
    title: "Purchase Number",
    dataIndex: "purchaseNumber",
    key: "purchaseNumber",
  },
  {
    title: "Created At",
    dataIndex: "createdAt",
    key: "createdAt",
  },
  {
    title: "Student Name",
    dataIndex: "studentName",
    key: "studentName",
  },
  {
    title: "Instructor Name",
    dataIndex: "instructorName",
    key: "instructorName",
  },
  {
    title: "Price Paid",
    dataIndex: "pricePaid",
    key: "pricePaid",
  },
  {
    title: "Discount",
    dataIndex: "discount",
    key: "discount",
  },
];

const Completed = ({ searchTerm }: { searchTerm: string }) => {
  const [data, setData] = useState([]);

  useEffect(() => {
    const completedOrders = purchases.purchases
      .filter(
        (purchase) =>
          purchase.status === "completed" && !purchase.is_deleted,
      )
      .map((purchase: any) => {
        const cart = carts.carts.find((cart: any) => cart.id === purchase.cart_id);
        const course = courses.courses.find(
          (course: any) => course.id === cart?.course_id,
        );
        const student = users.users.find(
          (user: any) => user.id === cart?.student_id,
        );
        const instructor = users.users.find(
          (user: any) => user.id === course?.user_id,
        );

        return {
          key: purchase.id,
          courseName: course?.name,
          purchaseNumber: purchase.purchase_no,
          createdAt: formatDate(new Date(purchase.created_at)), // Format the date
          studentName: student ? student.name : "Unknown Student",
          instructorName: instructor ? instructor.name : "Unknown Instructor",
          pricePaid: `$${purchase.price_paid}`,
          discount: `${purchase.discount}%`,
        };
      })
      .filter((order: any) =>
        order.courseName?.toLowerCase().includes(searchTerm.toLowerCase()),
      );

    setData(completedOrders as any);
  }, [searchTerm]);

  return (
    <div>
      <Table columns={columns} dataSource={data} />
    </div>
  );
};

export default Completed;
