import { useState } from "react";
import { Form, Input, Button, Modal, Select, message } from "antd";
import { Editor } from "@tinymce/tinymce-react";
import { TINY_API_KEY } from "../../../services/config/apiClientTiny";
import { UserRole } from "../../../models/User";
import { AuthService } from "../../../services/authentication/auth.service";
import { SetCreateUserResponse } from "../../../models/api/setCreateUser";
const CreateUserProfile = () => {
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [role, setRole] = useState<UserRole>(UserRole.student);

  const token = localStorage.getItem('authToken');

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
    if (!token) {
      message.error("Authentication token is missing.");
      return;
    }

    const userData: SetCreateUserResponse['data'] = {
      name: values.name || null,
      password: values.password || null,
      email: values.email || null,
      role: values.role || null,
      description: values.description || null,
      avatar_url: values.avatar_url || null,
      video_url: values.video_url || null,
      phone_number: values.phone_number || null,
      bank_name: values.bank_name || null,
      bank_account_no: values.bank_account_no || null,
      bank_account_name: values.bank_account_name || null,
    };

    try {
      const response = await AuthService.createUser(userData, token);
      if (response.data.success) {
        message.success("User created successfully!");
        handleOk();
      } else {
        message.error("Failed to create user.");
      }
    } catch (error) {
      console.error("Error creating user:", error);
      message.error("An error occurred while creating the user.");
    }
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
    const hasSpecialChar = /[!@#$%^&*(),.?":{}|<>]/.test(value);
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

  console.log("Selected role:", role);

  return (
    <div className="mb-3">
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
        footer={null}
      >
        <Form
          name="create_user"
          onFinish={onFinish}
          layout="vertical"
          initialValues={{ role: UserRole.student }}
        >
          <Form.Item
            name="name"
            label="Name"
            rules={[{ required: true, message: "Please input the name!" }]}
          >
            <Input />
          </Form.Item>

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
            name="role"
            label="Role"
            rules={[{ required: true, message: "Please select a role!" }]}
          >
            <Select onChange={(value) => setRole(value as UserRole)}>
              <Select.Option value={UserRole.admin}>Admin</Select.Option>
              <Select.Option value={UserRole.student}>Student</Select.Option>
              <Select.Option value={UserRole.instructor}>Instructor</Select.Option>
            </Select>
          </Form.Item>

          {role === UserRole.instructor && (
            <>
              <Form.Item
                name="description"
                label="Description"
                rules={[{ required: true, message: "Please input the description!" }]}
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
                name="avatar_url"
                label="Avatar URL"
                rules={[{ required: true, message: "Please input the avatar URL!" }]}
              >
                <Input />
              </Form.Item>

              <Form.Item
                name="video_url"
                label="Video URL"
                rules={[{ required: true, message: "Please input the video URL!" }]}
              >
                <Input />
              </Form.Item>
            </>
          )}

          {role === UserRole.admin && (
            <>
              <Form.Item
                name="avatar_url"
                label="Avatar URL"
                rules={[{ required: true, message: "Please input the avatar URL!" }]}
              >
                <Input />
              </Form.Item>

              <Form.Item
                name="video_url"
                label="Video URL"
                rules={[{ required: true, message: "Please input the video URL!" }]}
              >
                <Input />
              </Form.Item>
            </>
          )}

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
