import React, { useState } from 'react';
import usersData from '../../../data/users.json'; // Adjust the path as necessary
import { User } from '../../../models/User';
import { Typography, Button, Modal, Form, Input, DatePicker } from 'antd';
import moment from 'moment';
import { Editor } from '@tinymce/tinymce-react'

const { Title } = Typography;

const StudentProfile = () => {
  const studentUser = usersData.users.find((user: User) => user.role === 'student');

  const [isModalVisible, setIsModalVisible] = useState(false);
  const [form] = Form.useForm();
  const [updatedAt, setUpdatedAt] = useState(new Date(studentUser?.updated_at || Date.now()));

  if (!studentUser) {
    return <div className="text-center text-red-500">No student user found.</div>;
  }

  const showModal = () => {
    setIsModalVisible(true);
    form.setFieldsValue({
      email: studentUser.email,
      name: studentUser.name,
      phone_number: studentUser.phone_number,
      dob: moment(studentUser.dob, 'YYYY-MM-DD'),
      description: studentUser.description,
    });
  };

  const handleOk = () => {
    form
      .validateFields()
      .then((values) => {
        console.log('Updated values: ', values);
        const currentTime = new Date();
        setUpdatedAt(currentTime);
        setIsModalVisible(false);
      })
      .catch((info) => {
        console.log('Validate Failed:', info);
      });
  };

  const handleCancel = () => {
    setIsModalVisible(false);
  };

  return (
    <div className="min-h-screen bg-gray-100 p-5 md:p-10">
      {/* Header */}
      <Title level={3} className="text-left" style={{ fontSize: '24px' }}>
        Student Information
      </Title>
      <p className="text-left text-gray-500" style={{ fontSize: '16px' }}>
       Manage Yours Information
      </p>

      {/* Basic Information */}
      <div className="mt-6 bg-white rounded-lg shadow-lg p-6">
        <Title level={5} style={{ fontSize: '20px' }}>
         Basic Information
        </Title>

        {/* Email */}
        <div className="flex flex-col p-4 border-b">
          <span className="text-gray-600" style={{ fontSize: '16px' }}>Email</span>
          <span className="text-black" style={{ fontSize: '18px' }}>{studentUser.email}</span>
        </div>

        {/* Name */}
        <div className="flex flex-col p-4 border-b">
          <span className="text-gray-600" style={{ fontSize: '16px' }}>User Name</span>
          <span className="text-black" style={{ fontSize: '18px' }}>{studentUser.name}</span>
        </div>

        {/* Role */}
        <div className="flex flex-col p-4 border-b">
          <span className="text-gray-600" style={{ fontSize: '16px' }}>Role</span>
          <span className="text-black" style={{ fontSize: '18px' }}>{studentUser.role}</span>
        </div>

        {/* Status */}
        <div className="flex flex-col p-4 border-b">
          <span className="text-gray-600" style={{ fontSize: '16px' }}>Status</span>
          <span className="text-black" style={{ fontSize: '18px' }}>{studentUser.status ? 'Active' : 'Inactive'}</span>
        </div>

        {/* Description */}
        <div className="flex flex-col p-4 border-b">
          <span className="text-gray-600" style={{ fontSize: '16px' }}>Description</span>
          <span className="text-black" style={{ fontSize: '18px' }}>{studentUser.description || 'Chưa cập nhật'}</span>
        </div>

        {/* Phone Number */}
        <div className="flex flex-col p-4 border-b">
          <span className="text-gray-600" style={{ fontSize: '16px' }}>Phone Number</span>
          <span className="text-black" style={{ fontSize: '18px' }}>{studentUser.phone_number}</span>
        </div>

        {/* Date of Birth */}
        <div className="flex flex-col p-4 border-b">
          <span className="text-gray-600" style={{ fontSize: '16px' }}>Date Of Birth</span>
          <span className="text-black" style={{ fontSize: '18px' }}>{studentUser.dob}</span>
        </div>

        {/* Created At */}
        <div className="flex flex-col p-4 border-b">
          <span className="text-gray-600" style={{ fontSize: '16px' }}>Created At</span>
          <span className="text-black" style={{ fontSize: '18px' }}>{new Date(studentUser.created_at).toLocaleString()}</span>
        </div>

        {/* Updated At */}
        <div className="flex flex-col p-4">
          <span className="text-gray-600" style={{ fontSize: '16px' }}>Updated At</span>
          <span className="text-black" style={{ fontSize: '18px' }}>{updatedAt.toLocaleString()}</span>
        </div>

        {/* Edit Button */}
        <div className="flex justify-end p-4">
          <Button type="primary" size="large" onClick={showModal}>
            Edit
          </Button>
        </div>
      </div>

      {/* Modal */}
      <Modal
        title="Edit Information"
        visible={isModalVisible}
        onOk={handleOk}
        onCancel={handleCancel}
      >
        <Form form={form} layout="vertical">
          <Form.Item
            label="Email"
            name="email"
            rules={[{ required: true, message: 'Please input your email!' }]}
          >
            <Input />
          </Form.Item>

          <Form.Item
            label="User Name"
            name="name"
            rules={[{ required: true, message: 'Please input your name!' }]}
          >
            <Input />
          </Form.Item>

          <Form.Item label="Phone Number" name="phone_number">
            <Input />
          </Form.Item>

          <Form.Item
            label="Date of Birth"
            name="dob"
            rules={[{ required: true, message: 'Please select your date of birth!' }]}
          >
            <DatePicker format="YYYY-MM-DD" />
          </Form.Item>

          <Form.Item label="Description" name="description">
            {/* Sử dụng TinyMCE Editor cho mô tả */}
            <Editor
              apiKey="your-tinymce-api-key" // Bạn có thể đăng ký và lấy key từ trang web của TinyMCE hoặc để trống để sử dụng miễn phí
              initialValue={studentUser.description}
              init={{
                height: 300,
                menubar: false,
                plugins: [
                  'advlist autolink lists link image charmap print preview anchor',
                  'searchreplace visualblocks code fullscreen',
                  'insertdatetime media table paste code help wordcount'
                ],
                toolbar:
                  'undo redo | formatselect | bold italic backcolor | \
                  alignleft aligncenter alignright alignjustify | \
                  bullist numlist outdent indent | removeformat | help'
              }}
              onEditorChange={(content) => form.setFieldsValue({ description: content })}
            />
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
};

export default StudentProfile;
