import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { Row, Col, Form, Input, Select, Popconfirm, Button } from "antd";
import { User, UserRole } from "../../../models/User";
import usersData from "../../../data/users.json";
import { HomeOutlined } from "@ant-design/icons";

const ViewUserProfileDetail = () => {
  const { id } = useParams<{ id: string }>();
  const [user, setUser] = useState<User | null>(null);
  const navigate = useNavigate();

  useEffect(() => {
    const userData = usersData.users.find((user) => user.id === id);
    if (userData) {
      setUser({
        ...userData,
        role: userData.role as UserRole,
        dob: new Date(userData.dob),
      });
    } else {
      setUser(null);
    }
  }, [id]);

  if (!user) {
    return <div>User not found</div>;
  }
  const rolesToInclude = [
    UserRole.INSTRUCTOR,
    UserRole.ADMIN,
    UserRole.STUDENT,
  ];

  return (
    <div className="mx-auto max-w-2xl p-5">
      <Row gutter={16} align="middle">
        <Col span={6} className="pl-40 text-center">
          <img
            src={user.avatar_url || ""}
            alt={`${user.name}'s avatar`}
            className="mx-auto h-36 w-36 rounded-full"
          />
          <h2 className="mt-2 text-lg font-semibold">{user.name}</h2>
          <div className="mt-4 flex justify-center">
            <Popconfirm
              title="Are you sure you want to delete this account?"
              onConfirm={() => console.log("Account deleted")}
              okText="Yes"
              cancelText="No"
            >
              <button className="rounded bg-red-500 px-4 py-2 text-white">
                Delete
              </button>
            </Popconfirm>
          </div>
        </Col>
        <Col span={18}>
          <Form layout="vertical">
            <Row gutter={16}>
              <Col span={12}>
                <Form.Item label="Name">
                  <Input value={user.name.split(" ")[0]} readOnly />
                </Form.Item>
              </Col>
              <Col span={12}>
                <Form.Item label="Role">
                  <Select value={user.role}>
                    {rolesToInclude.map((role) => (
                      <Select.Option key={role} value={role}>
                        {role.charAt(0).toUpperCase() +
                          role.slice(1).toLowerCase()}
                      </Select.Option>
                    ))}
                  </Select>
                </Form.Item>
              </Col>
            </Row>
            <Row gutter={16}>
              <Col span={12}>
                <Form.Item label="Email Address">
                  <Input value={user.email} readOnly />
                </Form.Item>
              </Col>
              <Col span={12}>
                <Form.Item label="Phone Number">
                  <Input value={user.phone_number} readOnly />
                </Form.Item>
              </Col>
            </Row>
            <Row gutter={16}>
              <Col span={12}>
                <Form.Item label="Status">
                  <Select value={user.status ? "Active" : "Inactive"}>
                    <Select.Option value="Active">Active</Select.Option>
                    <Select.Option value="Inactive">Inactive</Select.Option>
                  </Select>
                </Form.Item>
              </Col>
              <Col span={12}>
                <Form.Item label="Description">
                  <Input value={user.description} readOnly />
                </Form.Item>
              </Col>
              <Col span={12}>
                <Form.Item label="Date of Birth">
                  <Input value={user.dob.toDateString()} readOnly />
                </Form.Item>
              </Col>
              <Col span={12}>
                <Form.Item label="Balance">
                  <Input value={user.balance} readOnly />
                </Form.Item>
              </Col>
            </Row>
          </Form>
        </Col>
      </Row>
      <Button
        type="primary"
        icon={<HomeOutlined />}
        onClick={() => navigate("/admin/manage-user")}
      >
        Back to Home
      </Button>
    </div>
  );
};

export default ViewUserProfileDetail;
