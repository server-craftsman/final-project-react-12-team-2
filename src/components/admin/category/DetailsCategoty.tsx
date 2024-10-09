import { Link, useParams } from "react-router-dom"; // Remove useHistory
import { useNavigate } from "react-router-dom"; // Import useNavigate
import categoriesData from "../../../data/categories.json";
import { Button, Col, Form, Input, Row } from "antd";

const DetailsCategory = () => {
  const { id } = useParams();
  const navigate = useNavigate(); // Use useNavigate instead

  // Fetch the category data based on the id
  const category = categoriesData.categories.find((cat: { id: string }) => cat.id === id);

  if (!category) {
    return <div>Category not found.</div>;
  }

  return (
    <div>
      <Col span={24}>
        <Form layout="vertical">
          <Row gutter={16}>
            <Col span={12}>
              <Form.Item label="ID">
                <Input value={category.id.split(" ")[0]} readOnly />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item label="UserID">
                <Input value={category.user_id.split(" ")[0]} readOnly />
              </Form.Item>
            </Col>
          </Row>
          <Row gutter={16}>
            <Col span={12}>
              <Form.Item label="Name">
                <Input value={category.name} readOnly />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item label="Description">
                <Input value={category.description} readOnly />
              </Form.Item>
            </Col>
          </Row>
          <Row gutter={16}>
            <Col span={12}>
              <Form.Item label="IsDeleted">
                <Input value={category.is_deleted ? "Yes" : "No"} readOnly />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item label="ParentCategoryId">
                <Input value={category.parent_category_id} readOnly />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item label="Created At">
                <Input value={category.created_at} readOnly />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item label="Updated At">
                <Input value={category.updated_at} readOnly />
              </Form.Item>
            </Col>
          </Row>
        </Form>
      </Col>

      <Button
        onClick={() => navigate(`/admin/edit-category/${id}`)}
        className="bg-yellow-400 mr-3"
      >
        Edit
      </Button>
      <Button className="bg-red-700 mr-3">Delete</Button>
      <Link to="/admin/categories">
        <Button className="bg-gray-300">Back</Button>
      </Link>
    </div>
  );
};

export default DetailsCategory;