import React, { useState, useEffect } from 'react';
import { Modal, List, Typography, Space, Pagination } from 'antd';
import { GetCourseResponsePageData } from '../../../models/api/responsive/course/course.response.model';
import { helpers } from '../../../utils';

interface DetailCourseModalProps {
  visible: boolean;
  onClose: () => void;
  courses: GetCourseResponsePageData[];
}

const DetailCourseModal: React.FC<DetailCourseModalProps> = ({ visible, onClose, courses }) => {
  const [pageNum, setPageNum] = useState<number>(1);
  const [pageSize, setPageSize] = useState<number>(10);
  const [paginatedData, setPaginatedData] = useState<GetCourseResponsePageData[]>(courses || []);

  useEffect(() => {
    // Update paginated data whenever pageNum or pageSize changes
    const start = (pageNum - 1) * pageSize;
    const end = pageNum * pageSize;
    setPaginatedData(courses.slice(start, end) || []);
  }, [pageNum, pageSize, courses]);

  const handlePageChange = (page: number, pageSize?: number) => {
    setPageNum(page);
    if (pageSize) setPageSize(pageSize);
  };

  return (
    <Modal
      title={<Typography.Title level={3}>Course List</Typography.Title>}
      open={visible}
      onCancel={onClose}
      footer={null}
      width={800}
      className="course-modal"
    >
      <List
        dataSource={paginatedData}
        renderItem={course => (
          <List.Item 
            key={course._id}
            className="p-4 hover:bg-gray-50 transition-colors duration-200"
          >
            <Space size={20} align="start">
              <img 
                src={course.image_url} 
                alt={course.name} 
                width={150} 
                height={100} 
                className="rounded-lg object-cover shadow-sm"
              />
              <Space direction="vertical">
                <Typography.Title level={4} className="!mb-1">
                  {course.name}
                </Typography.Title>
                <Typography.Paragraph className="text-gray-500 !mb-1">
                  {helpers.moneyFormat(course.price)}
                </Typography.Paragraph>
                <Typography.Paragraph className="text-gray-500 !mb-1">
                  {course.description?.slice(0, 150)}
                </Typography.Paragraph>
              </Space>
            </Space>
          </List.Item>
        )}
      />
      <Pagination
        current={pageNum}
        pageSize={pageSize}
        total={courses.length || 0}
        onChange={handlePageChange}
        showSizeChanger
        showTotal={(total, range) => `${range[0]}-${range[1]} of ${total} items`}
      />
    </Modal>
  );
};

export default DetailCourseModal;
