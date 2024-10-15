import { useState } from "react";
import { Form, Input, Button, Modal } from "antd";
import { Editor } from "@tinymce/tinymce-react";
import { TINY_API_KEY } from "../../../services/config/apiClientTiny";

const CreateUserProfile = () => {
  // const [form] = Form.useForm();

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
    console.log("Received values of form: ", values);
    // Add logic to handle form submission, e.g., sending data to an API
    handleOk(); // Close the modal after submission
  };

  const emailValidationRules = [
    {
      required: true,
      message: "Please input a valid email!",
    },
    {
      validator: (_: any, value: string) =>
        value && value.endsWith("@gmail.com")
          ? Promise.resolve()
          : Promise.reject(new Error("Email must end with @gmail.com")),
    },
  ];

  const phoneNumberValidationRules = [
    {
      pattern: /^\d{10}$/,
      message: "Phone number must be 10 digits!",
    },
  ];

  const validatePassword = (_: any, value: string) => {
    const hasUpperCase = /[A-Z]/.test(value);
    const hasNumber = /\d/.test(value);
    const hasSpecialChar = /[!@#$%^&*(),.?":{}|<>]/.test(value); // Added special character validation
    if (
      !value ||
      value.length < 8 ||
      !hasUpperCase ||
      !hasNumber ||
      !hasSpecialChar
    ) {
      return Promise.reject(
        new Error(
          "Password must be at least 8 characters long, contain at least one uppercase letter, one number, and one special character.",
        ),
      );
    }
    return Promise.resolve();
  };

  const validateConfirmPassword = ({ getFieldValue }: any) => ({
    validator(_: any, value: string) {
      if (!value || getFieldValue("password") === value) {
        return Promise.resolve();
      }
      return Promise.reject(new Error("The two passwords do not match!"));
    },
  });

  return (
    <div className="mb-4">
      <Button
        type="primary"
        onClick={showModal}
        className="bg-gradient-tone ml-4 text-white"
      >
        Create User
      </Button>
      <Modal
        title="Create User Profile"
        open={isModalVisible}
        onOk={handleOk}
        onCancel={handleCancel}
        footer={null} // Remove default footer buttons
      >
        <Form name="create_user" onFinish={onFinish} layout="vertical">
          <Form.Item
            name="email"
            label="Email"
            rules={[
              { required: true, message: "Please input the email!" },
              ...emailValidationRules,
            ]}
          >
            <Input />
          </Form.Item>

          <Form.Item
            name="password"
            label="Password"
            rules={[
              { required: true, message: "Please input the password!" },
              { validator: validatePassword },
            ]}
          >
            <Input.Password />
          </Form.Item>

          <Form.Item
            name="confirm_password"
            label="Confirm Password"
            rules={[
              { required: true, message: "Please confirm the password!" },
              validateConfirmPassword,
            ]}
          >
            <Input.Password />
          </Form.Item>

          <Form.Item
            name="description"
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
              //   onEditorChange={(content, editor) => {
              //     // Handle the content change
              //   }}
            />
          </Form.Item>

          <Form.Item
            name="phone_number"
            label="Phone Number"
            rules={[
              { required: true, message: "Please input the phone number!" },
              ...phoneNumberValidationRules,
            ]}
          >
            <Input />
          </Form.Item>

          <Form.Item
            name="avatar_url"
            label="Avatar URL"
            rules={[
              { required: true, message: "Please input the avatar URL!" },
            ]}
          >
            <Input />
          </Form.Item>

          <Form.Item>
            <Button
              type="primary"
              htmlType="submit"
              className="bg-gradient-tone text-white"
            >
              Submit
            </Button>
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
};

export default CreateUserProfile;
