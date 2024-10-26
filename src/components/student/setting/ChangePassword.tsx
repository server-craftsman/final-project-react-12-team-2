import { Form, Input, Button, Typography, message } from "antd";
const { Title } = Typography;
import { useAuth } from "../../../contexts/AuthContext";
import { useEffect } from "react";
import { UserService } from "../../../services/student/user.service";

interface ChangePasswordProps {
  visible: boolean;
  currentPassword: string;
}

const ChangePassword: React.FC<ChangePasswordProps> = () => {
  const [passwordForm] = Form.useForm();
  const { getCurrentUser, userInfo } = useAuth();

  useEffect(() => {
    getCurrentUser();
  }, []);

  const onFinish = async (values: any) => {
    if (!userInfo) {
      console.error("User information is not available.");
      return;
    }
    try {
      const response = await UserService.changePassword(userInfo._id, {
        user_id: userInfo._id,
        old_password: values.currentPassword,
        new_password: values.newPassword
      });
      console.log("Password change successful", response);
      message.success("Password changed successfully");
    } catch (error) {
      console.error("Password change failed", error);
      message.error("Failed to change password. Please try again.");
    }
  };

  const validateConfirmPassword = ({ getFieldValue }: any) => ({
    validator(_: any, value: string) {
      if (!value || getFieldValue("newPassword") === value) {
        return Promise.resolve();
      }
      return Promise.reject(new Error("The two passwords do not match!"));
    }
  });

  return (
    <div style={{ maxWidth: 400, marginLeft: "30px" }}>
      <Title level={2}>Change Password</Title>
      <Form form={passwordForm} layout="vertical" onFinish={onFinish} autoComplete="off">
        <Form.Item name="currentPassword" label="Current Password" rules={[{ required: true, message: "Please input your current password!" }]}>
          <Input.Password />
        </Form.Item>

        <Form.Item name="newPassword" label="New Password" rules={[{ required: true, message: "Please input your new password!" }]}>
          <Input.Password />
        </Form.Item>

        <Form.Item name="confirmPassword" label="Confirm New Password" dependencies={["newPassword"]} rules={[{ required: true, message: "Please confirm your new password!" }, validateConfirmPassword]}>
          <Input.Password />
        </Form.Item>

        <Form.Item>
          <Button type="primary" htmlType="submit" className="border-blue-500 bg-blue-500 text-white hover:border-blue-600 hover:bg-blue-600">
            Change Password
          </Button>
        </Form.Item>
      </Form>
    </div>
  );
};

export default ChangePassword;
