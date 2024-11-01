import { Button, Form, Input, message, Modal, Select } from "antd";
const { Option } = Select;
import { useState } from "react";
import { EditOutlined } from "@ant-design/icons";
import { courses } from "../../../../data/courses.json";
import Editor from "../../../generic/tiny/Editor";
// eslint-disable-next-line @typescript-eslint/no-explicit-any
const EditButton = ({ data }: any) => {
  // console.log("🚀 ~ EditButton ~ data:", data);
  const { description } = data;
  const [isOpen, setIsOpen] = useState(false);
  const [form] = Form.useForm();
  form.setFieldsValue(data);
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

  const editChange = (value: string) => {
    form.setFieldsValue({ description: value });
  };
  return (
    <>
      <Button className="mr-2" icon={<EditOutlined />} onClick={() => openCreateModal()} />
      <Modal title="Edit Session" open={isOpen} onOk={handleOk} onCancel={handleCancel} width={800} style={{ top: "20px" }}>
        <Form form={form} layout="vertical">
          <Form.Item name="name" label="Name" rules={[{ required: true, message: "Please input the lesson name!" }]}>
            <Input />
          </Form.Item>
          <Form.Item name="course_id" label="Course" rules={[{ required: true, message: "Please select the session!" }]}>
            <Select>
              {courses.map((course: any) => (
                <Option key={course.id} value={course.id}>
                  {course.name}
                </Option>
              ))}
            </Select>
          </Form.Item>
          <Form.Item name="description" label="Description" rules={[{ required: true, message: "Please input the description!" }]}>
            <Editor initialValue={description} onEditorChange={editChange} />
          </Form.Item>
        </Form>
      </Modal>
    </>
  );
};

export default EditButton;
