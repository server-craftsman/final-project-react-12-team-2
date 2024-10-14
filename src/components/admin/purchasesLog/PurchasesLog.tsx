import { useState } from "react";
import { Purchases, PurchaseStatusEnum } from "../../../models/Purchases";
import purchaseLogData from '../../../data/purchases.json';
import { Course } from "../../../models/Course";
import courseData from "../../../data/courses.json";
import { User } from "../../../models/User";
import userData from "../../../data/users.json";
import { Table, Tag } from "antd";
import { Carts } from "../../../models/Carts";
import cartData from "../../../data/carts.json";
const PurchasesLog: React.FC = () => {
    const [purchasesLogData] = useState<Purchases[]>(
        purchaseLogData.purchases as unknown as Purchases[],
    );

    const [coursesData] = useState<Course[]>(courseData.courses as unknown as Course[]);
    const [cartsData] = useState<Carts[]>(cartData.carts as unknown as Carts[]);
    const [usersData] = useState<User[]>(userData.users as unknown as User[]);

    const getUsersNameByPurchaseId = (student_id: string) => {
        const user = usersData.find((user) => user.id === student_id);
        return user ? user.name : "Unknown User";
    };
    const purchasesWithCourseNameAndStudentName = purchasesLogData.map(purchase => {
        const cart = cartsData.find(c => c.id === purchase.cart_id);
        const course = coursesData.find(c => c.id === cart?.course_id);
        const student_name = getUsersNameByPurchaseId(cart?.student_id || '');
        const instructor_name = getUsersNameByPurchaseId(course?.user_id || '');
        return {
            ...purchase,
            course_name: course?.name || 'Unknown course',
            student_name: student_name || 'Unknown student',
            instructor_name: instructor_name || 'Unknown instructor',
        };
    });




    const columns = [
        {
            title: 'Course Name',
            dataIndex: 'course_name',
            key: 'course_name',

        },
        {
            title: 'Purchase Number',
            dataIndex: 'purchase_no',
            key: 'purchase_no',
        },
        {
            title: 'Status',
            dataIndex: 'status',
            key: 'status',
            render: (status: string) => {
                let color = '';
                let text = '';

                switch (status) {
                    case PurchaseStatusEnum.new:
                        color = 'blue';
                        text = 'New';
                        break;
                    case PurchaseStatusEnum.request_paid:
                        color = 'orange';
                        text = 'Request Paid';
                        break;
                    case PurchaseStatusEnum.completed:
                        color = 'green';
                        text = 'Completed';
                        break;
                    default:
                        color = 'gray';
                        text = 'Unknown Status';
                        break;
                }

                return <Tag color={color}>{text}</Tag>;
            },
        },
        {
            title: 'Price Paid',
            dataIndex: 'price_paid',
            key: 'price_paid',
        },
        {
            title: 'Discount',
            dataIndex: 'discount',
            key: 'discount',
        },
        {
            title: 'Student Name',
            dataIndex: 'student_name',
            key: 'student_name',

        },
        {
            title: 'Instructor Name',
            dataIndex: 'instructor_name',
            key: 'instructor_name',
        },
        {
            title: 'Created At',
            dataIndex: 'created_at',
            key: 'created_at',
        }
    ];


    return (
        <div>
            <Table columns={columns} dataSource={purchasesWithCourseNameAndStudentName} rowKey="id" />
        </div>
    );
};

export default PurchasesLog;
