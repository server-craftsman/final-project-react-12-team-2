import { useState } from 'react';
import { Form, Input, Button, Modal } from 'antd';
import { Editor } from '@tinymce/tinymce-react';

const CreateUserProfile = () => {
  const [isModalVisible, setIsModalVisible] = useState(false);

  const showModal = () => {
    setIsModalVisible(true);
  };

  const handleOk = () => {
    setIsModalVisible(false);
  };

  const handleCancel = () => {
    setIsModalVisible(false);
  };

  const onFinish = (values: any) => {
    console.log('Received values of form: ', values);
    // Add logic to handle form submission, e.g., sending data to an API
    handleOk(); // Close the modal after submission
  };

  return (
    <div className='mb-4'>
      <Button type="primary" onClick={showModal} className='bg-gradient-tone text-white'>
        Create User
      </Button>
      <Modal
        title="Create User Profile"
        open={isModalVisible}
        onOk={handleOk}
        onCancel={handleCancel}
        footer={null} // Remove default footer buttons
      >
        <Form
          name="create_user"
          onFinish={onFinish}
          layout="vertical"
        >
          <Form.Item
            name="email"
            label="Email"
            rules={[{ required: true, message: 'Please input the email!' }]}
          >
            <Input />
          </Form.Item>

          <Form.Item
            name="password"
            label="Password"
            rules={[{ required: true, message: 'Please input the password!' }]}
          >
            <Input.Password />
          </Form.Item>

          <Form.Item
            name="confirm_password"
            label="Confirm Password"
            rules={[{ required: true, message: 'Please confirm the password!' }]}
          >
            <Input.Password />
          </Form.Item>

          <Form.Item
            name="description"
            label="Description"
            rules={[{ required: true, message: 'Please input the description!' }]}
          >
            <Editor
            apiKey='ck3lwrqqoh4n7nuttaggpbfuwl9gx8ntcoo2zkfx7ms31hfr'
              initialValue=""
              init={{
                height: 300,
                menubar: false,
                plugins: [
                  'advlist autolink lists link image charmap print preview anchor',
                  'searchreplace visualblocks code fullscreen',
                  'insertdatetime media table paste code help wordcount'
                ],
                toolbar:
                  'undo redo | styleselect | bold italic | alignleft aligncenter alignright alignjustify | bullist numlist outdent indent | link image | code',
              }}
            //   onEditorChange={(content, editor) => {
            //     // Handle the content change
            //   }}
            />
          </Form.Item>

          <Form.Item
            name="phone_number"
            label="Phone Number"
            rules={[{ required: true, message: 'Please input the phone number!' }]}
          >
            <Input />
          </Form.Item>

          <Form.Item
            name="avatar_url"
            label="Avatar URL"
            rules={[{ required: true, message: 'Please input the avatar URL!' }]}
          >
            <Input />
          </Form.Item>

          <Form.Item>
            <Button type="primary" htmlType="submit" className='bg-gradient-tone text-white'>
              Submit
            </Button>
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
};

export default CreateUserProfile;
