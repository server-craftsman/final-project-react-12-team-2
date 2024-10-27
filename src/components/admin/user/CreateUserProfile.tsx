import { useState } from "react";
import { Form, Input, Button, Modal, message, Select } from "antd";
import { Editor } from "@tinymce/tinymce-react";
import { TINY_API_KEY } from "../../../services/config/apiClientTiny";
//import service
import { UserService } from "../../../services/admin/user.service";
import { handleUploadFile } from "../../../utils/upload"; // Import the upload function

const CreateUserProfile = () => {
  // const [form] = Form.useForm();

  const [isModalVisible, setIsModalVisible] = useState(false);
  const [uploading, setUploading] = useState(false); // State to manage uploading status

  const showModal = () => {
    setIsModalVisible(true);
  };

  const handleOk = () => {
    setIsModalVisible(false);
  };

  const handleCancel = () => {
    setIsModalVisible(false);
  };

  const onFinish = async (values: any) => {
    try {
      // Handle file upload if avatar_url is a file
      let avatarUrl = values.avatar_url;
      if (avatarUrl instanceof File) {
        setUploading(true);
        avatarUrl = await handleUploadFile(avatarUrl, "image");
        setUploading(false);
        if (!avatarUrl) {
          message.error("Failed to upload avatar image.");
          return;
        }
      }

      // Call createUser API
      const response = await UserService.createUser({
        ...values,
        avatar_url: avatarUrl,
      });

      if (response) {
        message.success("User created successfully!");
        handleOk(); // Close the modal after successful submission
      }
    } catch (error) {
      console.error("Error creating user:", error);
      message.error("Failed to create user. Please try again.");
    }
  };

  const emailValidationRules = [
    {
      required: true,
      message: "Please input a valid email!"
    },
    {
      validator: (_: any, value: string) => (value && value.endsWith("@gmail.com") ? Promise.resolve() : Promise.reject(new Error("Email must end with @gmail.com")))
    }
  ];

  const phoneNumberValidationRules = [
    {
      pattern: /^\d{10}$/,
      message: "Phone number must be 10 digits!"
    }
  ];

  const validatePassword = (_: any, value: string) => {
    const hasUpperCase = /[A-Z]/.test(value);
    const hasNumber = /\d/.test(value);
    const hasSpecialChar = /[!@#$%^&*(),.?":{}|<>]/.test(value);
    if (!value || value.length < 8 || !hasUpperCase || !hasNumber || !hasSpecialChar) {
      return Promise.reject(new Error("Password must be at least 8 characters long, contain at least one uppercase letter, one number, and one special character."));
    }
    return Promise.resolve();
  };

  const validateConfirmPassword = ({ getFieldValue }: any) => ({
    validator(_: any, value: string) {
      if (!value || getFieldValue("password") === value) {
        return Promise.resolve();
      }
      return Promise.reject(new Error("The two passwords do not match!"));
    }
  });

  return (
    <div className="mb-3">
      <Button type="primary" onClick={showModal} className="bg-gradient-tone ml-4 text-white">
        Create User
      </Button>
      <Modal
        title="Create User Profile"
        open={isModalVisible}
        onOk={handleOk}
        onCancel={handleCancel}
        footer={null}
      >
        <Form name="create_user" onFinish={onFinish} layout="vertical">
          <Form.Item name="role" label="Role" rules={[{ required: true, message: "Please select a role!" }]}>
            <Select>
              <Select.Option value="student">Student</Select.Option>
              <Select.Option value="instructor">Instructor</Select.Option>
            </Select>
          </Form.Item>

          <Form.Item name="name" label="Name" rules={[{ required: true, message: "Please input the name!" }]}>
            <Input />
          </Form.Item>

          <Form.Item name="email" label="Email" rules={[{ required: true, message: "Please input the email!" }, ...emailValidationRules]}>
            <Input />
          </Form.Item>

          <Form.Item name="password" label="Password" rules={[{ required: true, message: "Please input the password!" }, { validator: validatePassword }]}>
            <Input.Password />
          </Form.Item>

          <Form.Item name="confirm_password" label="Confirm Password" rules={[{ required: true, message: "Please confirm the password!" }, validateConfirmPassword]}>
            <Input.Password />
          </Form.Item>

          <Form.Item shouldUpdate={(prevValues, currentValues) => prevValues.role !== currentValues.role}>
            {({ getFieldValue }) =>
              getFieldValue('role') === 'instructor' && (
                <>
                  <Form.Item name="description" label="Description" rules={[{ required: true, message: "Please input the description!" }]}>
                    <Editor
                      apiKey={TINY_API_KEY}
                      initialValue="description"
                      init={{
                        height: 300,
                        menubar: false,
                        plugins: ["advlist autolink lists link image charmap print preview anchor", "searchreplace visualblocks code fullscreen", "insertdatetime media table paste code help wordcount"],
                        toolbar: "undo redo | styleselect | bold italic | alignleft aligncenter alignright alignjustify | bullist numlist outdent indent | link image | code"
                      }}
                    />
                  </Form.Item>

                  <Form.Item name="phone_number" label="Phone Number" rules={[{ required: true, message: "Please input the phone number!" }, ...phoneNumberValidationRules]}>
                    <Input />
                  </Form.Item>

                  <Form.Item name="avatar_url" label="Avatar URL" rules={[{ required: true, message: "Please input the avatar URL!" }]}>
                    <Input type="file" />
                  </Form.Item>

                  <Form.Item name="video_url" label="Video URL" rules={[{ required: true, message: "Please input the video URL!" }]}>
                    <Input />
                  </Form.Item>

                  <Form.Item name="bank_name" label="Bank Name" rules={[{ required: true, message: "Please input the bank name!" }]}>
                    <Input />
                  </Form.Item>

                  <Form.Item name="bank_account_no" label="Bank Account No" rules={[{ required: true, message: "Please input the bank account number!" }]}>
                    <Input />
                  </Form.Item>

                  <Form.Item name="bank_account_name" label="Bank Account Name" rules={[{ required: true, message: "Please input the bank account name!" }]}>
                    <Input />
                  </Form.Item>
                </>
              )
            }
          </Form.Item>

          <Form.Item>
            <Button type="primary" htmlType="submit" className="bg-gradient-tone text-white" loading={uploading}>
              Submit
            </Button>
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
};

export default CreateUserProfile;
