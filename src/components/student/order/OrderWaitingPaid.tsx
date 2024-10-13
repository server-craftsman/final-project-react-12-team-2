import React from "react";
import { Table } from "antd";
//import data
import courseData from "../../../data/courses.json";
import purchaseData from "../../../data/purchases.json";
import userData from "../../../data/users.json";
import cartData from "../../../data/carts.json";
import { PurchaseStatusEnum } from "../../../models/Purchases";

const OrderWaitingPaid: React.FC<{ searchTerm: string }> = ({ searchTerm }) => {
  const columns = [
    {
      title: "Course Name",
      dataIndex: "courseName",
      key: "courseName",
    },
    {
      title: "Purchased Number",
      dataIndex: "purchasedNumber",
      key: "purchasedNumber",
    },
    {
      title: "Created Date",
      dataIndex: "createdDate",
      key: "createdDate",
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

  const dataSource = purchaseData
    .filter(
      (purchase) =>
        purchase.status === PurchaseStatusEnum.request_paid.toString(),
    )
    .map((purchase) => {
      const cart = cartData.find((cart) => cart.id === purchase.cart_id);
      const course = courseData.courses.find(
        (course) => course.id === cart?.course_id,
      );
      const user = userData.users.find((user) => user.id === cart?.student_id);
      return {
        key: purchase.id,
        courseName: course?.name,
        purchasedNumber: purchase.purchase_no,
        createdDate: purchase.created_at.toString(),
        studentName: user?.name,
        instructorName: user?.name,
        pricePaid: purchase.price_paid,
        discount: purchase.discount,
      };
    })
    .filter((item) =>
      Object.values(item).some((value) =>
        String(value).toLowerCase().includes(searchTerm.toLowerCase()),
      ),
    );

  return (
    <div>
      <Table columns={columns} dataSource={dataSource} />
    </div>
  );
};

export default OrderWaitingPaid;
