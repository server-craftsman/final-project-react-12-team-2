import React, { useEffect, useState } from 'react';
import { Card, Row, Col, Button, Typography, Divider, Modal, Avatar } from 'antd';
import { CourseService } from '../../../services/course/course.service';
import { helpers } from '../../../utils';

const { Title, Text } = Typography;

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
    course_id: string;
  };
}

const DetailModal: React.FC<DetailModalProps> = ({ visible, onClose, details }) => {
    const [courseDetail, setCourseDetail] = useState<any>(null);

    const fetCourseDetails = async () => {
        const response = await CourseService.getPublicCourseDetail(details.course_id);
        setCourseDetail(response.data.data);
    }
    useEffect(() => {
        fetCourseDetails();
    }, []);

  return (
    <Modal
      title={<Title level={3} style={{ color: '#3e2723' }}>Purchase Details</Title>}
      open={visible}
      onCancel={onClose}
      footer={[
        <Button key="close" onClick={onClose}>
          Close
        </Button>
      ]}
    >
      <Card bordered={false} style={{ boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)' }}>
        <Col style={{ marginBottom: '16px' }}>
          <Text strong style={{ fontSize: '16px', color: '#3e2723' }}>Purchase No: {details.purchase_no}</Text>
        </Col>
        <Divider />
        <Row gutter={16} align="middle">
          <Col>
            <img src={courseDetail?.image_url} alt="Product" style={{ width: 100, borderRadius: '8px' }} />
          </Col>
          <Col flex="auto">
            <Title level={4} style={{ color: '#3e2723' }}>{details.course_name}</Title>
            <Avatar className='bg-blue-500 text-white uppercase mr-2'>
              {courseDetail?.instructor_name ? courseDetail.instructor_name[0] : "U"}
            </Avatar>
            <Text strong style={{ color: '#5d4037' }}>{details.instructor_name}</Text>
          </Col>
          <Col flex="auto" style={{ textAlign: 'right', display: 'flex', flexDirection: 'column', alignItems: 'flex-end' }}>

            <Text strong style={{ fontSize: '18px', color: '#b71c1c', marginLeft: '8px' }}>
              {helpers.moneyFormat(details.price_paid)}
            </Text>
            {details.discount > 0 && (
              <>
                <Text strong style={{ fontSize: '18px', color: '#1a237e', textDecoration: 'line-through' }}>
                  {helpers.moneyFormat(details.price)}
                </Text>
                <Text strong style={{ fontSize: '16px', color: '#3e2723', marginTop: '4px' }}>
                  {details.discount}% OFF
                </Text>
              </>
            )}
          </Col>
        </Row>
        <Divider />
      </Card>
    </Modal>
  );
}

export default DetailModal;
