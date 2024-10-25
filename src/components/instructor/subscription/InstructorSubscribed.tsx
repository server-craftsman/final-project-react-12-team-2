import React from "react";
import { Card, Avatar, Row, Col } from "antd";
import { User } from "../../../models/prototype/User";
import { Subscriptions } from "../../../models/prototype/Subscriptions";
import { formatDate } from "../../../utils/helper"; // Add this import at the top of the file

const InstructorSubscribed: React.FC<{
  subscriptions: Subscriptions[];
  users: User[];
}> = ({ subscriptions, users }) => {
  return (
    <div style={{ backgroundColor: "#f0f2f5" }}>
      <Row gutter={[12, 12]}>
        {subscriptions.map((subscription) => {
          const user = users.find((user) => user.id === subscription.instructor_id);
          return (
            <Col span={8} key={subscription.id}>
              <Card
                title={
                  <div style={{ display: "flex", alignItems: "center" }}>
                    <Avatar src={user?.avatar_url} size={64} style={{ marginRight: "16px" }} />
                    <span style={{ fontSize: "24px", fontWeight: "bold" }}>{user?.name}</span>
                  </div>
                }
                style={{
                  borderRadius: "15px",
                  border: "2px solid #000",
                  boxShadow: "0 4px 8px rgba(0, 0, 0, 0.1)",
                  backgroundColor: "#f0f2f5"
                }}
              >
                <p style={{ fontSize: "18px", marginBottom: "8px" }}>
                  <strong>Subscription ID:</strong> {subscription.id}
                </p>
                <p style={{ fontSize: "18px", marginBottom: "8px" }}>
                  <strong>Email:</strong> {user?.email}
                </p>
                <p style={{ fontSize: "18px" }}>
                  <strong>Phone:</strong> {user?.phone_number}
                </p>
                <p style={{ fontSize: "18px", marginBottom: "8px" }}>
                  <strong>Subscription Date:</strong> {formatDate(new Date(subscription.created_at))}
                </p>
              </Card>
            </Col>
          );
        })}
      </Row>
    </div>
  );
};

export default InstructorSubscribed;
