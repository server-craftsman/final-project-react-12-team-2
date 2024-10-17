import React, { useEffect } from "react";
import { Modal, Form, Input, InputNumber, Select } from "antd";
import { Course, CourseStatusEnum } from "../../../models/Course";
import { RuleObject } from "antd/es/form";

const { Option } = Select;

interface EditCourseModalProps {
  visible: boolean;
  course: Course | null;
  onClose: () => void;
  onSubmit: (values: Course) => void;
}

const EditCourseModal: React.FC<EditCourseModalProps> = ({ visible, course, onClose, onSubmit }) => {
  const [form] = Form.useForm();

  const validateURL = (_: RuleObject, value: string) => {
    const urlPattern = /^(ftp|http|https):\/\/[^ "]+$/; 
    if (value && !urlPattern.test(value)) {
      return Promise.reject("Please enter a valid URL!");
    }
    return Promise.resolve();
  };
  useEffect(() => {
    if (visible && course) {
      form.setFieldsValue(course);
    }
  }, [visible, course, form]);
  return (
    <Modal
      title="Edit Course"
      open={visible}
      onCancel={onClose}
      onOk={() => form.submit()}
    >
      <Form
        form={form}
        onFinish={onSubmit}
        initialValues={course || { status: CourseStatusEnum.active }}
      >
        <Form.Item name="name" label="Name" rules={[{ required: true }]}>
          <Input />
        </Form.Item>
        <Form.Item name="category_id" label="Category" rules={[{ required: true }]}>
          <Input />
        </Form.Item>
        <Form.Item name="description" label="Description" rules={[{ required: true }]}>
          <Input.TextArea />
        </Form.Item>
        <Form.Item name="content" label="Content" rules={[{ required: true }]}>
          <Input.TextArea />
        </Form.Item>
        <Form.Item name="status" label="Status" rules={[{ required: true }]}>
          <Select>
            {Object.keys(CourseStatusEnum).map((key) => (
              <Option key={key} value={CourseStatusEnum[key as keyof typeof CourseStatusEnum]}>
                {CourseStatusEnum[key as keyof typeof CourseStatusEnum]}
              </Option>
            ))}
          </Select>
        </Form.Item>
        <Form.Item name="price" label="Price" rules={[{ required: true }]}>
          <InputNumber min={0} />
        </Form.Item>
        <Form.Item name="video_url" label="Video URL" rules={[{ required: true , validator : validateURL }]}>
          <Input />
        </Form.Item>
        <Form.Item name="image_url" label="Image URL" rules={[{ required: true , validator : validateURL }]}>
          <Input />
        </Form.Item>
      </Form>
    </Modal>
  );
};

export default EditCourseModal;
