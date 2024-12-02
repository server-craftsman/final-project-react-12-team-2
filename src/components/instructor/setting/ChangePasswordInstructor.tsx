import { Form, Input, Button, message } from "antd";
import { useAuth } from "../../../contexts/AuthContext";
import { useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { UserService } from "../../../services/instructor/user.service";
import { helpers } from "../../../utils";
import { HttpException } from "../../../app/exceptions";
import { ROUTER_URL } from "../../../const/router.path";

const ChangePasswordInstructor: React.FC = () => {
  const [form] = Form.useForm();
  const navigate = useNavigate();
  const { getCurrentUser, userInfo, logout } = useAuth();

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
        old_password: values.old_password,
        new_password: values.new_password
      });
      if (response) {
        message.success("Password changed successfully");
        form.resetFields();
        logout();
        navigate(ROUTER_URL.LOGIN);
      }
    } catch (error) {
      if (error instanceof HttpException) {
        message.error(error.message || "Cannot change password");
      } else {
        message.error("Please check the information you entered");
        console.error("Error changing password:", error);
      }
    }
  };

  const validatePassword = (_: unknown, value: string) => {
    if (helpers.isEmptyObject(value)) {
      return Promise.reject(new Error("Please enter a new password"));
    }

    const hasUpperCase = /[A-Z]/.test(value);
    const hasNumber = /\d/.test(value);
    const hasSpecialChar = /[!@#$%^&*(),.?":{}|<>]/.test(value);
    const hasMinLength = value.length >= 8;

    if (!hasMinLength || !hasUpperCase || !hasNumber || !hasSpecialChar) {
      return Promise.reject(new Error("Password must be at least 8 characters long, contain at least one uppercase letter, one number, and one special character."));
    }

    return Promise.resolve();
  };

  const validateConfirmPassword = (_: unknown, value: string) => {
    if (helpers.isEmptyObject(value)) {
      return Promise.reject(new Error("Please confirm your new password"));
    }

    if (value !== form.getFieldValue("new_password")) {
      return Promise.reject(new Error("Confirm password does not match the new password"));
    }

    return Promise.resolve();
  };

  return (
    <div className="max-w-10xl mx-auto rounded-xl bg-white p-8 shadow-2xl">
      <h1 className="mb-6 text-center text-3xl font-bold text-[#1a237e]">Change Password</h1>
      <Form form={form} onFinish={onFinish} layout="vertical" name="change_password_form" className="space-y-4">
        <Form.Item name="old_password" label={<span className="font-medium text-[#1a237e]">Current Password</span>} rules={[{ required: true, message: "Please input your current password!" }]}>
          <Input.Password visibilityToggle={true} className="rounded-lg border-[#1a237e] hover:border-[#1a237e] focus:border-[#1a237e]" />
        </Form.Item>

        <Form.Item name="new_password" label={<span className="font-medium text-[#1a237e]">New Password</span>} rules={[{ validator: validatePassword }]}>
          <Input.Password visibilityToggle={true} className="rounded-lg border-[#1a237e] hover:border-[#1a237e] focus:border-[#1a237e]" />
        </Form.Item>

        <Form.Item name="confirm_password" label={<span className="font-medium text-[#1a237e]">Confirm Password</span>} dependencies={["new_password"]} rules={[{ validator: validateConfirmPassword }]}>
          <Input.Password visibilityToggle={true} className="rounded-lg border-[#1a237e] hover:border-[#1a237e] focus:border-[#1a237e]" />
        </Form.Item>

        <div className="text-right">
          <Link to="/forgot-password" className="text-[#1a237e] hover:text-[#0d1453]">
            Forgot Password?
          </Link>
        </div>

        <Form.Item className="mt-6 flex justify-end gap-4">
          <Button type="primary" htmlType="submit" className="mr-2 h-10 border-none bg-[#1a237e] px-8 hover:bg-[#0d1453]">
            Change Password
          </Button>
        </Form.Item>
      </Form>
    </div>
  );
};

export default ChangePasswordInstructor;
