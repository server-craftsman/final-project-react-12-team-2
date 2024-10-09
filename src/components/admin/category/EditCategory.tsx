import { useParams, Link } from "react-router-dom";
import { Button, Form, Input, Row, Col } from "antd";
import categoriesData from "../../../data/categories.json";

const EditCategory = () => {
  const { id } = useParams();
  const category = categoriesData.categories.find((cat: { id: string }) => cat.id === id);

  if (!category) {
    return <div>Category not found.</div>;
  }

  const onFinish = (values: unknown) => {
    // Logic để lưu thông tin chỉnh sửa (có thể là gọi API để cập nhật danh mục)
    console.log("Updated values:", values);
  };

  return (
    <Form layout="vertical" onFinish={onFinish} initialValues={category}>
      <Row gutter={16}>
        <Col span={12}>
          <Form.Item label="ID" name="id">
            <Input readOnly />
          </Form.Item>
        </Col>
        <Col span={12}>
          <Form.Item label="UserID" name="user_id">
            <Input readOnly />
          </Form.Item>
        </Col>
      </Row>
      <Row gutter={16}>
        <Col span={12}>
          <Form.Item label="Name" name="name">
            <Input />
          </Form.Item>
        </Col>
        <Col span={12}>
          <Form.Item label="Is Deleted" name="is_deleted">
            <Input />
          </Form.Item>
        </Col>
      </Row>
      <Row gutter={16}>
        <Col span={12}>
          <Form.Item label="Description" name="description">
            <Input />
          </Form.Item>
        </Col>
        <Col span={12}>
          <Form.Item label="Parent Category ID" name="parent_category_id">
            <Input />
          </Form.Item>
        </Col>
      </Row>
      <Row gutter={16}>
        <Col span={12}>
          <Form.Item label="Created At" name="created_at">
            <Input readOnly />
          </Form.Item>
        </Col>
        <Col span={12}>
          <Form.Item label="Updated At" name="updated_at">
            <Input readOnly />
          </Form.Item>
        </Col>
      </Row>
      <Form.Item>
        <Button type="primary" htmlType="submit">
          Save
        </Button>
        <Link to={`/admin/categories/categories-details/${id}`}>
          <Button className="ml-3">Back</Button>
        </Link>
      </Form.Item>
    </Form>
  );
};

export default EditCategory;