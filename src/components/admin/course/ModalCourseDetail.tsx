import React from 'react';
import { Modal, Button } from 'antd';
import { GetCourseByIdResponse } from '../../../models/api/responsive/course/course.response.model';
import { formatDate } from '../../../utils/helper';

interface ModalCourseDetailProps {
  visible: boolean;
  onClose: () => void;
  courseDetail: GetCourseByIdResponse | null;
}

const ModalCourseDetail: React.FC<ModalCourseDetailProps> = ({ visible, onClose, courseDetail }) => {
  return (
    <Modal
      width={1000}
      title="Course Details"
      visible={visible}
      onCancel={onClose}
      footer={[
        <Button key="close" onClick={onClose}>
          Close
        </Button>
      ]}
    >
      {courseDetail ? (
        <div>
          <div className="ant-row" style={{ padding: '8px 0' }}>
            <span className="ant-col ant-col-8" style={{ fontWeight: 'bold' }}>Name:</span>
            <span className="ant-col ant-col-16">{courseDetail.name}</span>
          </div>
          <div className="ant-row" style={{ padding: '8px 0' }}>
            <span className="ant-col ant-col-8" style={{ fontWeight: 'bold' }}>Status Style:</span>
            <span className="ant-col ant-col-16">{courseDetail.status}</span>
          </div>
          <div className="ant-row" style={{ padding: '8px 0' }}>
            <span className="ant-col ant-col-8" style={{ fontWeight: 'bold' }}>Description:</span>
            <span className="ant-col ant-col-16">{courseDetail.description}</span>
          </div>
          <div className="ant-row" style={{ padding: '8px 0' }}>
            <span className="ant-col ant-col-8" style={{ fontWeight: 'bold' }}>Watch Video:</span>
            <a className="ant-col ant-col-16" href={courseDetail.video_url} target="_blank" rel="noopener noreferrer">Watch Now</a>
          </div>
          <div className="ant-row" style={{ padding: '8px 0' }}>
            <span className="ant-col ant-col-8" style={{ fontWeight: 'bold' }}>Image URL:</span>
            <img className="ant-col ant-col-16" src={courseDetail.image_url} alt="Course" style={{ maxWidth: '100%', height: 'auto' }} />
          </div>
          <div className="ant-row" style={{ padding: '8px 0' }}>
            <span className="ant-col ant-col-8" style={{ fontWeight: 'bold' }}>Price:</span>
            <span className="ant-col ant-col-16">{courseDetail.price}</span>
          </div>
          <div className="ant-row" style={{ padding: '8px 0' }}>
            <span className="ant-col ant-col-8" style={{ fontWeight: 'bold' }}>Discount:</span>
            <span className="ant-col ant-col-16">{courseDetail.discount}%</span>
          </div>
          <div className="ant-row" style={{ padding: '8px 0' }}>
            <span className="ant-col ant-col-8" style={{ fontWeight: 'bold' }}>Created At:</span>
            <span className="ant-col ant-col-16">{formatDate(new Date(courseDetail.created_at))}</span>
          </div>
        </div>
      ) : (
        <p>No course details available.</p>
      )}
    </Modal>
  );
};

export default ModalCourseDetail;
