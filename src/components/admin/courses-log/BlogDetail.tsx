import React from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import coursesData from "../../../data/courses.json";
import { Button, Col, Form, Input, Row } from "antd";
import { ROUTER_URL } from "../../../const/router.path";
const BlogDetail: React.FC = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const blog = coursesData.courses.find((blog: { id: string }) => blog.id === id);

  if (!blog) {
    return <div>Blog not found.</div>;
  }
  return (
    <div>
      <Col span={24}>
        <Form layout="vertical">
          <Row gutter={16}>
            <Col span={12}>
              <Form.Item label="ID">
                <Input value={blog.id.split(" ")} readOnly />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item label="CategoryID">
                <Input value={blog.category_id.split(" ")} readOnly />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item label="UserID">
                <Input value={blog.user_id.split(" ")} readOnly />
              </Form.Item>
            </Col>
          </Row>
          <Row gutter={16}>
            <Col span={12}>
              <Form.Item label="Name">
                <Input value={blog.name} readOnly />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item label="Description">
                <Input value={blog.description} readOnly />
              </Form.Item>
            </Col>
          </Row>
          <Row gutter={16}>
            <Col span={12}>
              <Form.Item label="Content">
                <Input value={blog.content} readOnly />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item label="Status">
                <Input value={blog.status} readOnly />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item label="Video_URL">
                <Input value={blog.video_url} readOnly />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item label="Image_URL">
                <Input value={blog.image_url} readOnly />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item label="Price">
                <Input value={blog.price} readOnly />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item label="Discount">
                <Input value={blog.discount} readOnly />
              </Form.Item>
            </Col>
            <Col>
              <Form.Item label="Created At">
                <Input value={blog.created_at} readOnly />
              </Form.Item>
            </Col>
            <Col>
              <Form.Item label="Updated At">
                <Input value={blog.updated_at} readOnly />
              </Form.Item>
            </Col>
            <Col>
              <Form.Item label="IsDeleted">
                <Input value={blog.is_deleted ? "Yes" : "No"} readOnly />
              </Form.Item>
            </Col>
          </Row>
        </Form>
      </Col>

      <Button onClick={() => navigate(`/admin/edit-courses-log/${id}`)} className="mr-3 bg-gradient-to-r from-indigo-600 to-indigo-800 text-white">
        Edit
      </Button>
      <Button className="mr-3 bg-gradient-to-r from-indigo-600 to-indigo-800 text-white">Delete</Button>
      <Link to={ROUTER_URL.ADMIN.COURSES_LOG}>
        <Button className="bg-gradient-to-r from-indigo-600 to-indigo-800 text-white">Back To Categories</Button>
      </Link>
    </div>
  );
};

export default BlogDetail;
