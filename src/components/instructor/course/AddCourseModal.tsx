import React from "react";
import { Modal, Form, Input, InputNumber, Select } from "antd";
import { Course, CourseStatusEnum } from "../../../models/Course";
import { RuleObject } from "antd/es/form";

const { Option } = Select;

interface AddCourseModalProps {
  visible: boolean;
  onClose: () => void;
  onSubmit: (values: Course) => void;
}

const AddCourseModal: React.FC<AddCourseModalProps> = ({ visible, onClose, onSubmit }) => {
  const [form] = Form.useForm();

  const handleCancel = () => {
    form.resetFields(); 
    onClose(); 
  };

  const validateURL = (_: RuleObject, value: string) => {
    const urlPattern = /^(ftp|http|https):\/\/[^ "]+$/; 
    
    if (!value) {
      return Promise.reject("URL is required!");
    }
  
    if (!urlPattern.test(value)) {
      return Promise.reject("Please enter a valid URL!");
    }
    return Promise.resolve();
  };

  return (
    <Modal
      title="Create Course"
      open={visible}
      onCancel={() => { onClose(); handleCancel() }}
      onOk={() => form.submit()}
    >
      <Form form={form} onFinish={onSubmit}>
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
          <InputNumber 
            min={0}  
            onKeyDown={(event) => {
              if (!/[0-9]/.test(event.key)) {
                event.preventDefault(); 
              }
          }}/>
        </Form.Item>
        <Form.Item name="video_url" label="Video URL" rules={[{ required: true , validator: validateURL}]}>
          <Input />
        </Form.Item>
        <Form.Item name="image_url" label="Image URL" rules={[{ required: true, validator: validateURL }]}>
          <Input />
        </Form.Item>
      </Form>
    </Modal>
  );
};

export default AddCourseModal;
