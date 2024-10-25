import { Form, Input, Button } from "antd";

const ChangePasswordAdmin = ({ visible, currentPassword }: { visible: boolean; currentPassword: string }) => {
  const [form] = Form.useForm();

  const handleOk = () => {
    form
      .validateFields()
      .then((values) => {
        console.log("Password changed:", values);
      })
      .catch((info) => {
        console.log("Validate Failed:", info);
      });
  };

  const validatePassword = (_: unknown, value: string) => {
    const hasUpperCase = /[A-Z]/.test(value);
    const hasNumber = /\d/.test(value);
    const hasSpecialChar = /[!@#$%^&*(),.?":{}|<>]/.test(value); // Added special character validation
    if (!value || value.length < 8 || !hasUpperCase || !hasNumber || !hasSpecialChar) {
      return Promise.reject(new Error("Password must be at least 8 characters long, contain at least one uppercase letter, one number, and one special character."));
    }
    return Promise.resolve();
  };

  const validateConfirmPassword = (_: unknown, value: string) => {
    if (!value || value !== form.getFieldValue("newPassword")) {
      return Promise.reject(new Error("The two passwords that you entered do not match!"));
    }
    return Promise.resolve();
  };

  return (
    <div className={`change-password-form ${visible ? "visible" : "hidden"}`}>
      <Form form={form} layout="vertical" name="change_password_form">
        <Form.Item name="currentPassword" label="Current Password" initialValue={currentPassword} rules={[{ required: true, message: "Please input your current password!" }]}>
          <Input.Password visibilityToggle={true} />
        </Form.Item>

        <Form.Item name="newPassword" label="New Password" rules={[{ required: true, message: "Please input your new password!" }, { validator: validatePassword }]}>
          <Input.Password visibilityToggle={true} />
        </Form.Item>
        <Form.Item name="confirmPassword" label="Confirm Password" dependencies={["newPassword"]} rules={[{ required: true, message: "Please confirm your password!" }, { validator: validateConfirmPassword }]}>
          <Input.Password visibilityToggle={true} />
        </Form.Item>
        <div className="form-footer">
          <Button type="primary" onClick={handleOk}>
            Change Password
          </Button>
        </div>
      </Form>
    </div>
  );
};

export default ChangePasswordAdmin;
