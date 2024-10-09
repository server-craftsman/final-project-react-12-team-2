/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { useState } from 'react'
import { getOrderStatus } from '../../utils/helper';
import { Table } from 'antd';

const CoursesManagement = () => {
    const [coursesData, setCoursesData] = useState([]);
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
            render: (status: any) => getOrderStatus(status), 
        },
        {
            title: 'Created At',
            dataIndex: 'createdAt',
            key: 'createdAt',
        },
    ];
    
  return (
    <div>
      <Table columns={columns} dataSource={coursesData}/>
    </div>
  )
}

export default CoursesManagement
