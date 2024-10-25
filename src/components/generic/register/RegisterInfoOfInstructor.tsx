import React from "react";
import { Form, Input, Upload, Button } from "antd";
import { UploadOutlined, PhoneOutlined } from "@ant-design/icons";

const RegisterInfoOfInstructor: React.FC = () => {
  return (
    <Form layout="vertical" className="mt-4">
      <Form.Item name="phone" rules={[{ required: true, message: "Please input your phone number!" }]}>
        <Input prefix={<PhoneOutlined className="site-form-item-icon text-indigo-600" />} placeholder="Phone Number" />
      </Form.Item>

      <Form.Item name="description" rules={[{ required: true, message: "Please input a description!" }]}>
        <Input.TextArea placeholder="Description" />
      </Form.Item>
      <div className="flex justify-between">
        <Form.Item name="video" label="Video" rules={[{ required: true, message: "Please upload an introduction video!" }]}>
          <Upload>
            <Button icon={<UploadOutlined className="site-form-item-icon text-indigo-600" />} className="h-24 w-24 rounded-full">
              Upload
            </Button>
          </Upload>
        </Form.Item>

        <Form.Item name="avatar" label="Avatar" rules={[{ required: true, message: "Please upload an avatar!" }]}>
          <Upload>
            <Button icon={<UploadOutlined className="site-form-item-icon text-indigo-600" />} className="h-24 w-24 rounded-full">
              Upload
            </Button>
          </Upload>
        </Form.Item>
      </div>
    </Form>
  );
};

export default RegisterInfoOfInstructor;
