import { useParams, Link } from "react-router-dom";
import { Button, Form, Input, Row, Col } from "antd";
import categoriesData from "../../../data/categories.json";

const EditCategory = () => {
  const { id } = useParams();
  const category = categoriesData.categories.find(
    (cat: { id: string }) => cat.id === id,
  );

  if (!category) {
    return <div>Category not found.</div>;
  }

  const onFinish = (values: unknown) => {
    // Logic to save edited information (could be an API call to update the category)
    console.log("Updated values:", values);
  };

  return (
    <Form
      layout="vertical"
      onFinish={onFinish}
      initialValues={{
        ...category,
      }}
    >
      <Row gutter={16}>
        <Col span={12}>
          <Form.Item label="Name" name="name">
            <Input />
          </Form.Item>
        </Col>
        <Col span={12}>
          <Form.Item label="Description" name="description">
            <Input />
          </Form.Item>
        </Col>
      </Row>
      <Form.Item>
        <Button type="primary" htmlType="submit">
          Save
        </Button>
        <Link to={`/admin/categories`}>
          <Button className="ml-3">Back</Button>
        </Link>
      </Form.Item>
    </Form>
  );
};

export default EditCategory;
