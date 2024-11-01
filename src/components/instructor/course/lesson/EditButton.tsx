import { Button, Form, Input, message, Modal, Select } from "antd";
const { Option } = Select;
import { useEffect, useState } from "react";
import { EditOutlined } from "@ant-design/icons";
import { courses } from "../../../../data/courses.json";
import { sessions as sessionData } from "../../../../data/sessions.json";
import Editor from "../../../generic/tiny/Editor";
// eslint-disable-next-line @typescript-eslint/no-explicit-any
const EditButton = ({ data }: any) => {
  // console.log("🚀 ~ EditButton ~ data:", data);
  const [isOpen, setIsOpen] = useState(false);
  const [form] = Form.useForm();
  const { description } = data;
  const [sessions, setSessions] = useState([]);
  useEffect(() => {
    form.setFieldsValue(data);
    handleCourseChange(data.course_id);
  }, [data, form]);
  const openCreateModal = () => {
    setIsOpen(true);
  };
  const handleOk = async () => {
    await form.validateFields();
    message.info("Edited");
    setIsOpen(false);
    form.resetFields();
  };

  const handleCancel = () => {
    setIsOpen(false);
    form.resetFields();
  };
  function handleCourseChange(courseId: string): void {
    setSessions(
      sessionData.filter((session) => {
        return session.course_id.toString() === courseId.toString();
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
      }) as any
    );
  }
  const editChange = (value: string) => {
    form.setFieldsValue({ description: value });
  };

  return (
    <>
      <Button className="mr-2" icon={<EditOutlined />} onClick={() => openCreateModal()} />
      <Modal title="Edit Lesson" open={isOpen} onOk={handleOk} onCancel={handleCancel} width={800} style={{ top: "20px" }}>
        <Form form={form} layout="vertical">
          <Form.Item name="name" label="Name" rules={[{ required: true, message: "Please input the lesson name!" }]}>
            <Input />
          </Form.Item>
          <Form.Item name="course_id" label="Course" rules={[{ required: true, message: "Please select the course!" }]}>
            <Select onChange={handleCourseChange}>
              {courses.map((course) => (
                <Option key={course.id} value={course.id}>
                  {course.name}
                </Option>
              ))}
            </Select>
          </Form.Item>
          <Form.Item name="session_id" label="Session" rules={[{ required: true, message: "Please select the session!" }]}>
            <Select>
              {sessions.map((session: any) => (
                <Option key={session.id} value={session.id}>
                  {session.name}
                </Option>
              ))}
            </Select>
          </Form.Item>
          <Form.Item name="image_url" label="Image Url" rules={[{ required: true, message: "Please input the image url!" }]}>
            <Input />
          </Form.Item>
          <Form.Item name="video_url" label="Video Url" rules={[{ required: true, message: "Please input the video url!" }]}>
            <Input />
          </Form.Item>
          <Form.Item name="description" label="Description" rules={[{ required: true, message: "Please input the description!" }]}>
            <Editor initialValue={description} onEditorChange={editChange} />
          </Form.Item>
          <Form.Item
            name="full_time"
            label="Full Time (minutes)"
            rules={[
              {
                required: true,
                message: "Please input the full time in minutes!"
              }
            ]}
          >
            <Input type="number" />
          </Form.Item>
          <Form.Item name="position_order" label="Position Order" rules={[{ required: true, message: "Please input the position order!" }]}>
            <Input type="number" />
          </Form.Item>
        </Form>
      </Modal>
    </>
  );
};

export default EditButton;
