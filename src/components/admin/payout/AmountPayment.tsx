import { Row, Col, Typography } from "antd";
import { DollarCircleOutlined, CheckCircleOutlined } from "@ant-design/icons";
import React, { useEffect, useState } from "react";
import ViewChartPayment from "../payout/ViewChartPayment";
import paymentsData from "../../../data/payouts.json";
import { moneyFormat } from "../../../utils/helper";

const { Title } = Typography;

const AmountPayment: React.FC = () => {
  const [totalPayment, setTotalPayment] = useState<string>("");
  const [completedInstructorPayment, setCompletedInstructorPayment] =
    useState<string>("");

  useEffect(() => {
    // Calculate total payment from balance origin
    const total = paymentsData.payments
      .filter((payment) => payment.balance_origin)
      .reduce((acc, payment) => acc + payment.balance_origin, 0);

    const formattedTotal = moneyFormat(total);
    setTotalPayment(formattedTotal);
  }, []);

  useEffect(() => {
    // Calculate total completed instructor payment
    const totalCompleted = paymentsData.payments
      .filter((payment) => payment.status === "COMPLETED")
      .reduce((acc, payment) => acc + payment.balance_instructor_received, 0);

    const formattedCompletedTotal = moneyFormat(totalCompleted);
    setCompletedInstructorPayment(formattedCompletedTotal);
  }, []);

  return (
    <Row gutter={16}>
      <Col
        span={10} // Increased span for better balance
        style={{
          padding: "50px",
          border: "1px solid white", // Changed border color
          borderRadius: "12px", // Increased border radius for a smoother look
          textAlign: "center",
          boxShadow: "0 4px 12px rgba(0, 0, 0, 0.1)", // Added shadow for depth
        }}
      >
        <Row gutter={[0, 16]}>
          <Col
            span={24}
            style={{
              border: "1px solid #ccc",
              padding: "20px", // Increased padding for better spacing
              textAlign: "center",
              background: "linear-gradient(135deg, #e2f0cb, #b2d3c2)", // Gradient background
              borderRadius: "8px", // Rounded corners for inner box
            }}
          >
            <Title level={3} style={{ color: "#4CAF50", margin: 0 }}>
              <DollarCircleOutlined style={{ marginRight: 8 }} />
              Total Payment
            </Title>
            <h1
              style={{
                textAlign: "center",
                marginTop: "10px",
                padding: "10px",
                fontSize: "30px",
              }}
            >
              <strong>{totalPayment}</strong>
            </h1>
          </Col>

          <Col
            span={24}
            style={{
              border: "1px solid #ccc",
              padding: "20px", // Increased padding for better spacing
              textAlign: "center",
              background: "linear-gradient(135deg, #cfe7f5, #9dc1e8)", // Gradient background
              borderRadius: "8px", // Rounded corners for inner box
            }}
          >
            <Title level={3} style={{ color: "#2F80ED", margin: 0 }}>
              <CheckCircleOutlined style={{ marginRight: 8 }} />
              Instructor Received (Completed)
            </Title>
            <h1
              style={{
                textAlign: "center",
                marginTop: "10px",
                padding: "10px",
                fontSize: "30px",
              }}
            >
              <strong>{completedInstructorPayment}</strong>
            </h1>
          </Col>
        </Row>
      </Col>

      <Col
        span={14} // Adjusted span to balance with the left column
        style={{
          padding: "20px",
          border: "1px solid white", // Consistent border color
          borderRadius: "12px", // Increased border radius for a smoother look
          boxShadow: "0 4px 12px rgba(0, 0, 0, 0.1)", // Added shadow for depth
        }}
      >
        <ViewChartPayment />
      </Col>
    </Row>
  );
};

export default AmountPayment;
