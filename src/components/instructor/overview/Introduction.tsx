import { Card, Row, Col, Typography, Statistic } from "antd";
import {
  BookOutlined,
  UserOutlined,
  DollarOutlined,
  PlusOutlined,
} from "@ant-design/icons";

const { Title } = Typography;

const Introduction = () => {
  return (
    <div className="p-6">
      <Title level={2} className="mb-6">
        Dashboard
      </Title>
      <Row gutter={[16, 16]}>
        <Col xs={24} sm={12} md={8}>
          <Card>
            <Statistic
              title="Total Courses"
              value={10} // Replace with actual value
              prefix={<BookOutlined className="mr-2" />}
              suffix={
                <PlusOutlined className="ml-2 cursor-pointer text-blue-500" />
              }
            />
          </Card>
        </Col>
        <Col xs={24} sm={12} md={8}>
          <Card>
            <Statistic
              title="Total Subscribers"
              value={1000} // Replace with actual value
              prefix={<UserOutlined className="mr-2" />}
              suffix={
                <PlusOutlined className="ml-2 cursor-pointer text-blue-500" />
              }
            />
          </Card>
        </Col>
        <Col xs={24} sm={12} md={8}>
          <Card>
            <Statistic
              title="Total Balance"
              value={5000} // Replace with actual value
              prefix={<DollarOutlined className="mr-2" />}
              suffix={
                <PlusOutlined className="ml-2 cursor-pointer text-blue-500" />
              }
            />
          </Card>
        </Col>
      </Row>
    </div>
  );
};

export default Introduction;
