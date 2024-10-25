import { Form, Input, Button, Typography, message } from "antd";
import { useEffect, useState } from "react";
import { UserService } from "../../../services/admin/user.service"; // Import UserService
import { User } from "../../../models/api/responsive/users/users.model";
import { useAuth } from "../../../contexts/AuthContext";
const { Title } = Typography;

const ChangePasswordInstructor: React.FC = () => {
  const [passwordForm] = Form.useForm();
  const [userDetails, setUserDetails] = useState<User | null>(null);
  const { userInfo } = useAuth();
  useEffect(() => {
    const fetchUserDetails = async () => {
      if (userInfo?._id) {
        try {
          const response = await UserService.getUserDetails(userInfo._id);
          console.log("Fetched user details:", response); // Log the response
          if (response && response.data) {
            const userData: User = {
              _id: response.data.data._id,
              name: response.data.data.name,
              email: response.data.data.email,
              phone_number: response.data.data.phone_number,
              role: response.data.data.role,
              status: response.data.data.status,
              description: response.data.data.description,
              dob: new Date(response.data.data.dob),
              balance: response.data.data.balance,
              avatar_url: response.data.data.avatar_url,
              google_id: response.data.data.google_id,
              video_url: response.data.data.video_url,
              is_verified: response.data.data.is_verified,
              verification_token: response.data.data.verification_token,
              verification_token_expires: new Date(response.data.data.verification_token_expires),
              token_version: response.data.data.token_version,
              balance_total: response.data.data.balance_total,
              bank_name: response.data.data.bank_name,
              bank_account_no: response.data.data.bank_account_no,
              bank_account_name: response.data.data.bank_account_name,
              created_at: new Date(response.data.data.created_at),
              updated_at: new Date(response.data.data.updated_at),
              is_deleted: response.data.data.is_deleted,
              __v: response.data.data.__v,
            };
            setUserDetails(userData);
            console.log("User details set:", userData); // Log the set data
          } else {
            console.warn("No user data found in response");
            setUserDetails(null);
          }
        } catch (error) {
          console.error("Error fetching user details:", error);
          setUserDetails(null);
        }
      } else {
        console.warn("No user ID provided");
      }
    };

    fetchUserDetails();
  }, [userInfo]);

  const onFinish = async (values: any) => {
    try {
      if (userDetails?._id) {
        // Change password using the retrieved user_id
        const response = await UserService.changePassword(
          userDetails._id,
          {
            user_id: userDetails._id,
            old_password: values.currentPassword,
            new_password: values.newPassword,
          },
        );

        if (response.data.success) {
          message.success("Password changed successfully!");
          passwordForm.resetFields();
        } else {
          message.error("Failed to change password.");
        }
      } else {
        message.error("User ID not found.");
      }
    } catch (error) {
      console.error("Error changing password:", error);
      message.error("An error occurred while changing the password.");
    }
  };

  const validatePassword = (_: any, value: string) => {
    if (!value) {
      return Promise.reject(new Error("Please input your password!"));
    }
    if (value.length < 8) {
      return Promise.reject(
        new Error("Password must be at least 8 characters long!"),
      );
    }
    if (!/[A-Z]/.test(value)) {
      return Promise.reject(
        new Error("Password must contain at least one uppercase letter!"),
      );
    }
    if (!/\d/.test(value)) {
      return Promise.reject(
        new Error("Password must contain at least one number!"),
      );
    }
    if (!/[!@#$%^&*(),.?":{}|<>]/.test(value)) {
      return Promise.reject(
        new Error("Password must contain at least one special character!"),
      );
    }
    return Promise.resolve();
  };

  const validateConfirmPassword = ({ getFieldValue }: any) => ({
    validator(_: any, value: string) {
      if (!value || getFieldValue("newPassword") === value) {
        return Promise.resolve();
      }
      return Promise.reject(new Error("The two passwords do not match!"));
    },
  });

  return (
    <div style={{ maxWidth: 400, marginLeft: "30px" }}>
      <Title level={2}>Change Password</Title>
      <Form
        form={passwordForm}
        layout="vertical"
        onFinish={onFinish}
        autoComplete="off"
      >
        <Form.Item
          name="currentPassword"
          label="Current Password"
          rules={[
            { required: true, message: "Please input your current password!" },
            // { validator: validatePassword },
          ]}
        >
          <Input.Password />
        </Form.Item>

        <Form.Item
          name="newPassword"
          label="New Password"
          rules={[
            { required: true, message: "Please input your new password!" },
            // { validator: validatePassword },
          ]}
        >
          <Input.Password />
        </Form.Item>

        <Form.Item
          name="confirmPassword"
          label="Confirm New Password"
          dependencies={["newPassword"]}
          rules={[
            { required: true, message: "Please confirm your new password!" },
            validateConfirmPassword,
          ]}
        >
          <Input.Password />
        </Form.Item>

        <Form.Item>
          <Button
            type="primary"
            htmlType="submit"
            className="border-blue-500 bg-blue-500 text-white hover:border-blue-600 hover:bg-blue-600"
          >
            Change Password
          </Button>
        </Form.Item>
      </Form>
    </div>
  );
};

export default ChangePasswordInstructor;
