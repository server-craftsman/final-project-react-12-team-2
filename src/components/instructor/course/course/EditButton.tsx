import { Editor } from "@tinymce/tinymce-react";
import {
  Button,
  Col,
  Form,
  Input,
  InputNumber,
  message,
  Modal,
  Row,
  Select,
} from "antd";
const { Option } = Select;
import { TINY_API_KEY } from "../../../../services/config/apiClientTiny";
import { useState } from "react";
import { EditOutlined } from "@ant-design/icons";
import { categories } from "../../../../data/categories.json";
// eslint-disable-next-line @typescript-eslint/no-explicit-any
const EditButton = ({ data }: any) => {
  const [isOpen, setIsOpen] = useState(false);
  const [form] = Form.useForm();
  const [description, setDescription] = useState<string>("");
  const [content, setContent] = useState<string>("");
  form.setFieldsValue(data);

  const openCreateModal = () => {
    setIsOpen(true);
  };
  const handleOk = async () => {
    await form.validateFields();
    setIsOpen(false);
    message.info("Edited");
    form.resetFields();
    setDescription("");
    setContent("");
  };

  const handleCancel = () => {
    setIsOpen(false);
    form.resetFields();
    setDescription("");
    setContent("");
  };

  return (
    <>
      <Button
        className="mr-2"
        icon={<EditOutlined />}
        onClick={() => openCreateModal()}
      />
      <Modal
        title="Edit Course"
        open={isOpen}
        onOk={handleOk}
        onCancel={handleCancel}
        width={800}
        style={{ top: "20px" }}
      >
        <Form
          form={form}
          layout="vertical"
          initialValues={{ description, content }}
        >
          <Row gutter={16}>
            <Col span={12}>
              <Form.Item
                name="name"
                label="Course Name"
                rules={[
                  { required: true, message: "Please input the course name!" },
                ]}
              >
                <Input />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item
                name="category_id"
                label="Category"
                rules={[
                  { required: true, message: "Please select a category!" },
                ]}
              >
                <Select placeholder="Select a category">
                  {categories.map((category) => (
                    <Option key={category.id} value={category.id.toString()}>
                      {category.name}
                    </Option>
                  ))}
                </Select>
              </Form.Item>
            </Col>
          </Row>
          <Form.Item
            name="description"
            label="Description"
            rules={[
              { required: true, message: "Please input the description!" },
            ]}
          >
            <Editor
              apiKey={TINY_API_KEY}
              initialValue="description"
              init={{
                height: 300,
                menubar: false,
                plugins: [
                  "advlist autolink lists link image charmap print preview anchor",
                  "searchreplace visualblocks code fullscreen",
                  "insertdatetime media table paste code help wordcount",
                ],
                toolbar:
                  "undo redo | styleselect | bold italic | alignleft aligncenter alignright alignjustify | bullist numlist outdent indent | link image | code",
              }}
            />
          </Form.Item>
          <Form.Item
            name="content"
            label="Content"
            rules={[{ required: true, message: "Please input the content!" }]}
          >
            <Editor
              apiKey={TINY_API_KEY}
              initialValue="content"
              init={{
                height: 300,
                menubar: false,
                plugins: [
                  "advlist autolink lists link image charmap print preview anchor",
                  "searchreplace visualblocks code fullscreen",
                  "insertdatetime media table paste code help wordcount",
                ],
                toolbar:
                  "undo redo | styleselect | bold italic | alignleft aligncenter alignright alignjustify | bullist numlist outdent indent | link image | code",
              }}
            />
          </Form.Item>
          <Row gutter={16}>
            <Col span={12}>
              <Form.Item
                name="image_url"
                label="Upload Image"
                rules={[{ required: true, message: "Please upload an image!" }]}
              >
                <Input />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item
                name="video_url"
                label="Upload Video"
                rules={[{ required: true, message: "Please upload a video!" }]}
              >
                <Input />
              </Form.Item>
            </Col>
          </Row>

          <Form.Item
            name="price"
            label="Price"
            rules={[{ required: true, message: "Please input the price!" }]}
          >
            <InputNumber
              min={0}
              style={{ width: "100%" }}
              formatter={(value) =>
                `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ",")
              }
            />
          </Form.Item>
          <Form.Item
            name="discount"
            label="Discount"
            rules={[{ required: true, message: "Please input the discount!" }]}
          >
            <InputNumber min={0} max={100} style={{ width: "100%" }} />
          </Form.Item>
        </Form>
      </Modal>
    </>
  );
};

export default EditButton;
