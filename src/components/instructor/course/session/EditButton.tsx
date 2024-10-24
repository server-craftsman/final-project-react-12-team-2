import { Editor } from "@tinymce/tinymce-react";
import { Button, Form, Input, message, Modal, Select } from "antd";
const { Option } = Select;
import { TINY_API_KEY } from "../../../../services/config/apiClientTiny";
import { useState } from "react";
import { EditOutlined } from "@ant-design/icons";
import { courses } from "../../../../data/courses.json";
// eslint-disable-next-line @typescript-eslint/no-explicit-any
const EditButton = ({ data }: any) => {
  // console.log("🚀 ~ EditButton ~ data:", data);
  const [isOpen, setIsOpen] = useState(false);
  const [form] = Form.useForm();
  form.setFieldsValue(data);
  const [, setDescription] = useState<string>("");
  const openCreateModal = () => {
    setIsOpen(true);
  };
  const handleOk = async () => {
    await form.validateFields();
    setIsOpen(false);
    message.info("Edited");
    form.resetFields();
  };

  const handleCancel = () => {
    setIsOpen(false);
    form.resetFields();
  };

  return (
    <>
      <Button
        className="mr-2"
        icon={<EditOutlined />}
        onClick={() => openCreateModal()}
      />
      <Modal
        title="Edit Session"
        open={isOpen}
        onOk={handleOk}
        onCancel={handleCancel}
        width={800}
        style={{ top: "20px" }}
      >
        <Form form={form} layout="vertical">
          <Form.Item
            name="name"
            label="Name"
            rules={[
              { required: true, message: "Please input the lesson name!" },
            ]}
          >
            <Input />
          </Form.Item>
          <Form.Item
            name="course_id"
            label="Course"
            rules={[{ required: true, message: "Please select the session!" }]}
          >
            <Select>
              {courses.map((course: any) => (
                <Option key={course.id} value={course.id}>
                  {course.name}
                </Option>
              ))}
            </Select>
          </Form.Item>
          <Form.Item
            name="description"
            label="Description"
            rules={[
              { required: true, message: "Please input the description!" },
            ]}
          >
            <Editor
              apiKey={TINY_API_KEY}
              initialValue="Description"
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
              onEditorChange={(content) => {
                setDescription(content);
                form.setFieldsValue({ description: content });
              }}
            />
          </Form.Item>
        </Form>
      </Modal>
    </>
  );
};

export default EditButton;
