import React from 'react';
import { Modal, Button } from 'antd';

interface DetailModalProps {
  visible: boolean;
  onClose: () => void;
  details: {
    purchase_no: string;
    course_name: string;
    instructor_name: string;
    status: string;
    price_paid: number;
    created_at: string;
    price: number;
    discount: number;
    cart_no: string;
    student_name: string;
  };
}

const DetailModal: React.FC<DetailModalProps> = ({ visible, onClose, details }) => {
  return (
    <Modal
      title="Purchase Details"
      visible={visible}
      onCancel={onClose}
      footer={[
        <Button key="close" onClick={onClose}>
          Close
        </Button>
      ]}
    >
      <div>
        <p><strong>Purchase No:</strong> {details.purchase_no}</p>
        <p><strong>Course Name:</strong> {details.course_name}</p>
        <p><strong>Instructor:</strong> {details.instructor_name}</p>
        <p><strong>Status:</strong> {details.status}</p>
        <p><strong>Price Paid:</strong> {details.price_paid}</p>
        <p><strong>Price:</strong> {details.price}</p>
        <p><strong>Discount:</strong> {details.discount}</p>
        <p><strong>Cart No:</strong> {details.cart_no}</p>
        <p><strong>Student Name:</strong> {details.student_name}</p>
        <p><strong>Created At:</strong> {details.created_at}</p>
      </div>
    </Modal>
  );
}

export default DetailModal;
