import { Form, Input, Button } from "antd";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../../contexts/AuthContext";
import { HttpException } from "../../../app/exceptions";
import { message } from "antd";
import { helpers } from "../../../utils";
import { ROUTER_URL } from "../../../const/router.path";

const ChangePasswordAdmin = ({ visible }: { visible: boolean }) => {
  const [form] = Form.useForm();
  const { changePassword } = useAuth();
  const navigate = useNavigate();

  const handleOk = async () => {
    try {
      const values = await form.validateFields();
      
      // Kiểm tra confirm password
      if (values.new_password !== values.confirm_password) {
        message.error('New password and confirm password do not match');
        return;
      }

      // Simplified params - remove user_id as it's handled by AuthContext
      const params = {
        old_password: values.old_password,
        new_password: values.new_password,
        user_id: '' // Add this if required by your API (e.g. for admin)
      };

      const response = await changePassword(params);
      if (response) {
        message.success('Password changed successfully');
        form.resetFields();
        navigate(ROUTER_URL.ADMIN.INFO);
      }
    } catch (error) {
      if (error instanceof HttpException) {
        message.error(error.message || 'Cannot change password');
      } else {
        message.error('Please check the information you entered');
        console.error('Error changing password:', error);
      }
    }
  };

  // Tăng cường validate password
  const validatePassword = (_: unknown, value: string) => {
    if (helpers.isEmptyObject(value)) {
      return Promise.reject(new Error("Please enter a new password"));
    }
    
    const hasUpperCase = /[A-Z]/.test(value);
    const hasNumber = /\d/.test(value);
    const hasSpecialChar = /[!@#$%^&*(),.?":{}|<>]/.test(value);
    const hasMinLength = value.length >= 8;

    if (!hasMinLength || !hasUpperCase || !hasNumber || !hasSpecialChar) {
      return Promise.reject(
        new Error(
          "Password must be at least 8 characters long, contain at least one uppercase letter, one number, and one special character."
        )
      );
    }

    return Promise.resolve();
  };

  // Tăng cường validate confirm password
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
    <div className={`max-w-10xl mx-auto rounded-xl bg-white p-8 shadow-2xl ${visible ? "" : "hidden"}`}>
      <h1 className="mb-6 text-center text-3xl font-bold text-[#1a237e]">Change Password</h1>
      <Form 
        form={form} 
        layout="vertical" 
        name="change_password_form"
        className="space-y-4"
      >
        <Form.Item 
          name="old_password" 
          label={<span className="font-medium text-[#1a237e]">Current Password</span>} 
          rules={[{ required: true, message: "Please input your current password!" }]}
        >
          <Input.Password 
            visibilityToggle={true} 
            className="rounded-lg border-[#1a237e] hover:border-[#1a237e] focus:border-[#1a237e]"
          />
        </Form.Item>

        <Form.Item 
          name="new_password" 
          label={<span className="font-medium text-[#1a237e]">New Password</span>} 
          rules={[{ validator: validatePassword }]}
        >
          <Input.Password 
            visibilityToggle={true}
            className="rounded-lg border-[#1a237e] hover:border-[#1a237e] focus:border-[#1a237e]"
          />
        </Form.Item>

        <Form.Item 
          name="confirm_password" 
          label={<span className="font-medium text-[#1a237e]">Confirm Password</span>} 
          dependencies={["new_password"]} 
          rules={[{ validator: validateConfirmPassword }]}
        >
          <Input.Password 
            visibilityToggle={true}
            className="rounded-lg border-[#1a237e] hover:border-[#1a237e] focus:border-[#1a237e]"
          />
        </Form.Item>

        <Form.Item className="mt-6 flex justify-end gap-4">
          <Button 
            type="primary" 
            onClick={handleOk}
            className="mr-2 h-10 border-none bg-[#1a237e] px-8 hover:bg-[#0d1453]"
          >
            Change Password
          </Button>
          <Button 
            onClick={() => navigate("/admin/admin-info")}
            className="h-10 border-[#1a237e] px-8 text-[#1a237e] hover:border-[#0d1453] hover:text-[#0d1453]"
          >
            Cancel
          </Button>
        </Form.Item>
      </Form>
    </div>
  );
};

export default ChangePasswordAdmin;
