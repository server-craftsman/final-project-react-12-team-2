import { Row, Col } from "antd";
import React, { useEffect, useState } from "react";
import ViewChartPayment from "../payout/ViewChartPayment";
import paymentsData from "../../../data/payouts.json";
import { moneyFormat } from "../../../utils/helper";

const AmountPayment: React.FC = () => {
  const [totalPayment, setTotalPayment] = useState<string>("");
  const [completedInstructorPayment, setCompletedInstructorPayment] =
    useState<string>("");

  useEffect(() => {
    // Tính tổng số tiền từ các payment origin
    const total = paymentsData.payments
      .filter((payment) => payment.balance_origin)
      .reduce((acc, payment) => acc + payment.balance_origin, 0);

    const formattedTotal = moneyFormat(total);
    setTotalPayment(formattedTotal);
  }, []);

  useEffect(() => {
    // Tính tổng số tiền từ Balance Instructor Received với trạng thái completed
    const totalCompleted = paymentsData.payments
      .filter((payment) => payment.status === "COMPLETED")
      .reduce((acc, payment) => acc + payment.balance_instructor_received, 0);

    const formattedCompletedTotal = moneyFormat(totalCompleted);
    setCompletedInstructorPayment(formattedCompletedTotal);
  }, []);

  return (
    <Row gutter={16}>
      <Col
        span={10}
        style={{
          backgroundColor: "#f0f2f5",
          padding: "20px",
          border: "1px solid #ccc",
          borderRadius: "8px",
        }}
      >
        <Row gutter={[0, 16]}>
          <Col
            span={24}
            style={{
              border: "1px solid #ccc",
              padding: "10px",
              textAlign: "center",
            }}
          >
            <p
              style={{
                color: "green",
                textAlign: "left",
                width: "250px",
                height: "100px",
                fontSize: "20px",
              }}
            >
              Total Payment: {totalPayment}
            </p>
          </Col>
          <Col
            span={24}
            style={{
              border: "1px solid #ccc",
              padding: "10px",
              textAlign: "center",
            }}
          >
            <p style={{ color: "red", textAlign: "left", fontSize: "20px" }}>
              Tax: 20%
            </p>
          </Col>
          <Col
            span={24}
            style={{
              border: "1px solid #ccc",
              padding: "10px",
              textAlign: "center",
            }}
          >
            <p style={{ color: "blue", textAlign: "left", fontSize: "20px" }}>
              Instructor Payment (Completed): {completedInstructorPayment}
            </p>
          </Col>
        </Row>
      </Col>

      <Col
        span={14}
        style={{
          backgroundColor: "#f0f2f5",
          padding: "20px",
          border: "1px solid #ccc",
          borderRadius: "8px",
        }}
      >
        <ViewChartPayment></ViewChartPayment>
      </Col>
    </Row>
  );
};

export default AmountPayment;
