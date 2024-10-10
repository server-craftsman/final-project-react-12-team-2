/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { useState } from 'react'
import { getOrderStatus, moneyFormat } from '../../../utils/helper';
import { Table } from 'antd';
import courseData from '../../../data/courses.json';
import { Course } from '../../../models/Course'; // Import the Course model

const CoursesManagement = React.memo(() => {
    const [coursesData] = useState<Course[]>(courseData.courses as unknown as Course[]);

    const columns = [
        {
            title: 'ID',
            dataIndex: 'id',
            key: 'id',
            render: (text: any) => `#${text}`,
        },
        {
            title: 'Name Course',
            dataIndex: 'name',
            key: 'name',
        },
        {
            title: 'Category',
            dataIndex: 'category_id',
            key: 'category_id',
        },
        {
            title: 'User ID',
            dataIndex: 'user_id',
            key: 'user_id',
        },
        {
            title: 'Price',
            dataIndex: 'price',
            key: 'price',
            render: (money: number) => moneyFormat(money),
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
            render: (status: any) => getOrderStatus(status), 
        },
        {
            title: 'Created At',
            dataIndex: 'created_at',
            key: 'created_at',
        },
    ];
    
  return (
    <Table columns={columns} dataSource={coursesData} rowKey="id" />
    )
})

export default CoursesManagement
