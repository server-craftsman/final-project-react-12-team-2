import { Button, Form, Input, message, Modal, Select } from "antd";
const { Option } = Select;
import { useState } from "react";
import TinyMCEEditor from "../../../generic/tiny/TinyMCEEditor";
import { SessionService } from "../../../../services/session/session.service";
import { CreateSessionRequestModel } from "../../../../models/api/request/session/session.request.model";
import { CreateSessionResponse } from "../../../../models/api/responsive/session/session.response.model";

const CreateButton = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [form] = Form.useForm();
  const [description, setDescription] = useState("");
  const openCreateModal = () => {
    setIsOpen(true);
  };
  const handleOk = async () => {
    await form.validateFields();
    setIsOpen(false);
    message.info("Created");
    form.resetFields();
  };

  const handleCancel = () => {
    setIsOpen(false);
    form.resetFields();
  };

  return (
    <>
      <Button onClick={() => openCreateModal()} className="rounded-md bg-[#1a237e] text-white">
        Create Session
      </Button>
      <Modal title="Create Session" open={isOpen} onOk={handleOk} onCancel={handleCancel} width={800} style={{ top: "20px" }}>
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
          <Form.Item label="Description" name="description" rules={[{ required: true, message: "Please input the description!" }]}>
            <TinyMCEEditor
              initialValue={description}
              onEditorChange={(content) => {
                setDescription(content);
                form.setFieldValue("description", content);
              }}
            />
          </Form.Item>
        </Form>
      </Modal>
    </>
  );
};

export default CreateButton;
