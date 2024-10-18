import { Editor } from "@tinymce/tinymce-react";
import { Button, Form, Input, message, Modal, Select } from "antd";
const { Option } = Select;
import { TINY_API_KEY } from "../../../../services/config/apiClientTiny";
import { useState } from "react";
import { courses } from "../../../../data/courses.json";
import { sessions as sessionData } from "../../../../data/sessions.json";
const CreateButton = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [form] = Form.useForm();
  const [sessions, setSessions] = useState([]);
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

  function handleCourseChange(courseId: string): void {
    setSessions(
      sessionData.map((session) => {
        if (session.course_id === courseId) {
          return session;
        }
        return;
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
      }) as unknown[] as any,
    );
    throw new Error("Function not implemented.");
  }

  return (
    <>
      <Button
        onClick={() => openCreateModal()}
        className="rounded-md bg-green-500 text-black"
      >
        Create Lesson
      </Button>
      <Modal
        title="Create Lesson"
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
            rules={[{ required: true, message: "Please select the course!" }]}
          >
            <Select onChange={handleCourseChange}>
              {courses.map((course) => (
                <Option key={course.id} value={course.id}>
                  {course.name}
                </Option>
              ))}
            </Select>
          </Form.Item>
          <Form.Item
            name="session_id"
            label="Session"
            rules={[{ required: true, message: "Please select the session!" }]}
          >
            <Select>
              {sessions.map((session: any) => (
                <Option key={session.id} value={session.id}>
                  {session.name}
                </Option>
              ))}
            </Select>
          </Form.Item>
          <Form.Item
            name="Image Url"
            label="Image Url"
            rules={[{ required: true, message: "Please input the image url!" }]}
          >
            <Input />
          </Form.Item>
          <Form.Item
            name="Video Url"
            label="Video Url"
            rules={[{ required: true, message: "Please input the video url!" }]}
          >
            <Input />
          </Form.Item>
          <Form.Item
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
            name="full_time"
            label="Full Time (minutes)"
            rules={[
              {
                required: true,
                message: "Please input the full time in minutes!",
              },
            ]}
          >
            <Input type="number" />
          </Form.Item>
          <Form.Item
            name="position_order"
            label="Position Order"
            rules={[
              { required: true, message: "Please input the position order!" },
            ]}
          >
            <Input type="number" />
          </Form.Item>
        </Form>
      </Modal>
    </>
  );
};

export default CreateButton;
