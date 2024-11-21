import React, { useState, useEffect } from 'react';
import { Modal, List, Typography, Space, Pagination } from 'antd';
import { helpers } from '../../../utils';

interface DetailSubscribersModalProps {
  visible: boolean;
  onClose: () => void;
  subscribers: any[];
}

const DetailSubscribersModal: React.FC<DetailSubscribersModalProps> = ({ visible, onClose, subscribers }) => {
  const [pageNum, setPageNum] = useState<number>(1);
  const [pageSize, setPageSize] = useState<number>(10);
  const [paginatedData, setPaginatedData] = useState<any[]>(subscribers || []);

  useEffect(() => {
    const start = (pageNum - 1) * pageSize;
    const end = pageNum * pageSize;
    setPaginatedData(subscribers.slice(start, end) || []);
  }, [pageNum, pageSize, subscribers]);

  const handlePageChange = (page: number, pageSize?: number) => {
    setPageNum(page);
    if (pageSize) setPageSize(pageSize);
  };

  return (
    <Modal
      title={<Typography.Title level={3}>Subscriber List</Typography.Title>}
      open={visible}
      onCancel={onClose}
      footer={null}
      width={600}
      className="subscriber-modal"
    >
      <List
        dataSource={paginatedData}
        renderItem={subscriber => (
          <List.Item 
            key={subscriber.id}
            className="p-4 hover:bg-gray-50 transition-colors duration-200"
          >
            <Space size={16} align="center">
            <img src={`https://ui-avatars.com/api/?name=${subscriber.name[0]}`} alt={subscriber.name} className="w-12 h-12 rounded-full mr-4" />

              <Space direction="vertical">
                <Typography.Text strong className="text-lg">
                  {subscriber.name || 'Unknown Subscriber'}
                </Typography.Text>
                <Typography.Text type="secondary">
                  Joined: {helpers.formatDate(subscriber.created_at)}
                </Typography.Text>
              </Space>
            </Space>
          </List.Item>
        )}
      />
      <Pagination
        current={pageNum}
        pageSize={pageSize}
        total={subscribers.length || 0}
        onChange={handlePageChange}
        showSizeChanger
        showTotal={(total, range) => `${range[0]}-${range[1]} of ${total} subscribers`}
        className="mt-4"
      />
    </Modal>
  );
};

export default DetailSubscribersModal;