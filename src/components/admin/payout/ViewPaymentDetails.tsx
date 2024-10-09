import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { Row, Col, Form, Input } from 'antd';
import paymentsData from '../../../data/payouts.json'; 
import { Payout, PayoutStatusEnum } from '../../../models/Payout'; 

const ViewPaymentDetails = () => {
  const { id } = useParams<{ id: string }>(); 
  const [payment, setPayment] = useState<Payout | null>(null);

  // Fetch the payment details based on the ID
  useEffect(() => {
    const paymentItem = paymentsData.payments.find(item => item.id === id);
    if (paymentItem) {
      setPayment({
        ...paymentItem,
        status: paymentItem.status as PayoutStatusEnum
      });
    } else {
      setPayment(null);
    }
  }, [id]);

  if (!payment) {
    return <div>Payment not found</div>;
  }

  return (
    <div className="max-w-2xl mx-auto p-5">
      <Row gutter={16} align="middle">
        <Col span={6} className="text-center pl-40">
          <h2 className="mt-2 text-lg font-semibold">Payout Details</h2>
        </Col>
        <Col span={18}>
          <Form layout="vertical">
            <Row gutter={16}>
              <Col span={12}>
                <Form.Item label="Payout ID">
                  <Input value={payment.id} readOnly />
                </Form.Item>
              </Col>
              <Col span={12}>
                <Form.Item label="Payout No">
                  <Input value={payment.payout_no} readOnly />
                </Form.Item>
              </Col>
            </Row>
            <Row gutter={16}>
              <Col span={12}>
                <Form.Item label="Amount Received">
                  <Input value={`$${payment.balance_instructor_received.toFixed(2)}`} readOnly />
                </Form.Item>
              </Col>
              <Col span={12}>
                <Form.Item label="Date Created">
                  <Input value={new Date(payment.created_at).toLocaleDateString()} readOnly />
                </Form.Item>
              </Col>
            </Row>
            <Row gutter={16}>
              <Col span={12}>
                <Form.Item label="Status">
                  <Input value={payment.status ? 'Completed' : 'Pending'} readOnly />
                </Form.Item>
              </Col>
            </Row>
          </Form>
        </Col>
      </Row>
    </div>
  );
};

export default ViewPaymentDetails;
