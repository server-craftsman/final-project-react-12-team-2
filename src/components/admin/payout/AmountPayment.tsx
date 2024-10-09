import { Row, Col } from 'antd';
import React, { useEffect, useState } from 'react';
import paymentsData from '../../../data/payouts.json';

const AmountPayment: React.FC = () => {
  const [totalPayment, setTotalPayment] = useState<number>(0); // Đặt kiểu cho state

  useEffect(() => {
    // Tính tổng số tiền từ các payment có status = true
    const total = paymentsData.payments
      .filter(payment => payment.status === 'true') // Lọc hoàn thành
      .reduce((acc, payment) => acc + payment.balance_instructor_received, 0); // Tính tổng amount

    setTotalPayment(total);
  }, []);

  const formattedTotalPayment = `$${totalPayment.toFixed(2)}`;

  return (
    <Row gutter={16}>
      {/* Phần 4 chia thành 3 */}
      <Col
        span={10}
        style={{
          backgroundColor: '#f0f2f5',
          padding: '20px',
          border: '1px solid #ccc',
          borderRadius: '8px',
        }}
      >
        <h2>Left Content (4/10)</h2>

        <Row gutter={[0, 16]}>
          <Col span={24} style={{ border: '1px solid #ccc', padding: '10px', textAlign: 'center' }}>
            <p style={{ color: 'green', textAlign: 'left', width: '150px', height: '100px', fontSize: '16px' }}>
              Total Payment: {formattedTotalPayment}
            </p>
          </Col>
          <Col span={24} style={{ border: '1px solid #ccc', padding: '10px', textAlign: 'center' }}>
            <p style={{ color: 'red', textAlign: 'left' }}>Tax: 20%</p>
          </Col>
          <Col span={24} style={{ border: '1px solid #ccc', padding: '10px', textAlign: 'center' }}>
            <p style={{ color: 'black', textAlign: 'left' }}>Instructor Payment</p>
          </Col>
        </Row>
      </Col>

      {/* Phần 6 */}
      <Col
        span={14}
        style={{
          backgroundColor: '#ffffff',
          padding: '20px',
          border: '1px solid #ccc',
          borderRadius: '8px',
        }}
      >
        <h2>Right Content (6/10)</h2>
        <p>This is the right side content for AmountPayment.</p>
      </Col>
    </Row>
  );
};

export default AmountPayment;
