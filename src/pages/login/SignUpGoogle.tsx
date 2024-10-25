import { useState } from "react";
import { Form, Input, Button, Select } from "antd";
import { AuthService } from "../../services/authentication/auth.service"; // Ensure this import is correct

interface SignUpFormProps {
  googleIdToken: string | null;
}

const SignUpForm: React.FC<SignUpFormProps> = ({ googleIdToken }) => {
  const [role, setRole] = useState<string>("student");
  const [form] = Form.useForm();

  const handleRoleChange = (value: string) => {
    setRole(value);
  };

  const onFinishSignUp = async (values: any) => {
    console.log("Sign-up values:", values);
    if (googleIdToken) {
      try {
        const result = await AuthService.registerGooglePublic({
          google_id: googleIdToken,
          ...values
        });
        console.log("Registration successful:", result);
        // Handle post-registration logic, e.g., navigate to a different page
      } catch (error) {
        console.error("Registration failed:", error);
      }
    }
  };

  return (
    <Form form={form} onFinish={onFinishSignUp}>
      <Form.Item name="role" label="Select Role" rules={[{ required: true }]}>
        <Select onChange={handleRoleChange}>
          <Select.Option value="student">Student</Select.Option>
          <Select.Option value="instructor">Instructor</Select.Option>
        </Select>
      </Form.Item>

      {role === "student" && (
        <>
          <Form.Item name="description" label="Description" rules={[{ required: true }]}>
            <Input.TextArea />
          </Form.Item>
          <Form.Item name="phoneNumber" label="Phone Number" rules={[{ required: true }]}>
            <Input />
          </Form.Item>
        </>
      )}

      {role === "instructor" && (
        <>
          <Form.Item name="avatar" label="Upload Avatar" rules={[{ required: true }]}>
            <Input type="file" />
          </Form.Item>
          <Form.Item name="video" label="Upload Video" rules={[{ required: true }]}>
            <Input type="file" />
          </Form.Item>
          <Form.Item name="description" label="Description" rules={[{ required: true }]}>
            <Input.TextArea />
          </Form.Item>
          <Form.Item name="phoneNumber" label="Phone Number" rules={[{ required: true }]}>
            <Input />
          </Form.Item>
        </>
      )}

      <Form.Item>
        <Button type="primary" htmlType="submit">
          Sign Up
        </Button>
      </Form.Item>
    </Form>
  );
};

export default SignUpForm;
