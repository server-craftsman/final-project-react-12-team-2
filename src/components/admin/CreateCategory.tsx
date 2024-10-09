import { Button, Form, Input, Modal } from "antd";
import { useForm } from "antd/es/form/Form";
import { useState } from "react";
import { Category } from "../../models/Category";

function CreateCategory() {
  const [categories, setCategories] = useState<Category[]>([]);
  const [isOpen, setOpen] = useState(false);
  const [form] = useForm();

  const handleSubmit = () => {
    try {
      const newCategory = form.getFieldsValue();

      setCategories([...categories, newCategory]);

      form.resetFields();

      setOpen(false);
    } catch (error) {
      console.error("Error creating category:", error);
    }
  };

  return (
    <div>
      <Button
        className=" mb-4 bg-gradient-tone  text-white"
        onClick={() => setOpen(true)}
      >
        Create New Categoty
      </Button>
      <Modal
        open={isOpen}
        onCancel={() => setOpen(false)}
        onOk={() => form.submit()}
      >
        <Form labelCol={{ span: 24 }} form={form} onFinish={handleSubmit}>
          <Form.Item
            label="Name"
            name="name"
            rules={[{ required: true, message: "Please input category name" }]}
          >
            <Input />
          </Form.Item>
          <Form.Item
            label="Description"
            name="description"
            rules={[
              { required: true, message: "Please input category description" },
            ]}
          >
            <Input.TextArea />
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
}

export default CreateCategory;
