import React, { useState } from "react";
import { Link } from "react-router-dom";
import { Form, Input, Button, Typography, Divider } from "antd";
import {
  UserOutlined,
  MailOutlined,
  LockOutlined,
  HomeOutlined,
} from "@ant-design/icons";
import registerAnimation from "../../data/registerAnimation.json";
import Lottie from 'lottie-react';
import ButtonDivideStudentAndInstructor from "../../components/generic/register/ButtonDivideStudentAndInstructor";
import RegisterInfoOfInstructor from "../../components/generic/register/RegisterInfoOfInstructor";
const { Title, Text } = Typography;

const RegisterPage = () => {
  const [form] = Form.useForm();
  const [role, setRole] = useState<string | null>(null);

  const onFinish = (values: any) => {
    console.log("Received values of form: ", values);
    console.log("Selected role: ", role);
  };

  const handleRoleSelection = (selectedRole: string) => {
    setRole(selectedRole);
  };

  const validateUsername = (_: any, value: string) => {
    if (!value || value.includes(" ") || value.length < 6) {
      return Promise.reject(
        new Error(
          "Username must be at least 6 characters long and contain no spaces.",
        ),
      );
    }
    return Promise.resolve();
  };

  const validateEmail = (_: any, value: string) => {
    if (!value || !value.endsWith("@gmail.com")) {
      return Promise.reject(new Error("Email must end with @gmail.com."));
    }
    return Promise.resolve();
  };

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

  const validateConfirmPassword = (_: any, value: string) => {
    if (!value || value !== form.getFieldValue("password")) {
      return Promise.reject(
        new Error("The two passwords that you entered do not match!"),
      );
    }
    return Promise.resolve();
  };
  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-gradient-to-r from-purple-900/20 to-indigo-900/20 backdrop-blur-md">
      <div className="relative flex w-full max-w-5xl flex-col overflow-hidden rounded-2xl bg-white shadow-2xl md:flex-row">
        <div className="flex w-full flex-col items-center justify-center bg-gradient-to-br from-indigo-900 to-purple-900 p-12 md:w-1/2">
          <Link to="/">
            <Lottie animationData={registerAnimation} loop={true} />
          </Link>
          <h2 className="text-white text-3xl font-bold">Edu Learn</h2>
          <Text className="mt-4 text-center text-white text-lg">
            Elevate Your Learning Experience
          </Text>
        </div>
        <div className="w-full bg-gradient-to-br from-white to-gray-100 p-12 md:w-1/2">
          <Link
            to="/"
            className="mb-8 flex items-center text-lg text-indigo-600 transition-colors duration-300 hover:text-indigo-800"
          >
            <HomeOutlined className="mr-2" />
            Back to Home
          </Link>
          <Title level={2} className="mb-8 text-indigo-900">
            Create an Account
          </Title>
          <Form
            form={form}
            name="register"
            onFinish={onFinish}
            scrollToFirstError
            layout="vertical"
          >
            <Form.Item
              name="username"
              rules={[
                { required: true, message: "Please input your username!" },
                { validator: validateUsername },
              ]}
            >
              <Input
                prefix={
                  <UserOutlined className="site-form-item-icon text-indigo-600" />
                }
                placeholder="Username"
                className="rounded-lg px-4 py-2"
              />
            </Form.Item>

            <Form.Item
              name="email"
              rules={[
                { required: true, message: "Please input your E-mail!" },
                { validator: validateEmail },
              ]}
            >
              <Input
                prefix={
                  <MailOutlined className="site-form-item-icon text-indigo-600" />
                }
                placeholder="Email"
                className="rounded-lg px-4 py-2"
              />
            </Form.Item>

            <Form.Item
              name="password"
              rules={[
                { required: true, message: "Please input your password!" },
                { validator: validatePassword },
              ]}
              hasFeedback
            >
              <Input.Password
                prefix={
                  <LockOutlined className="site-form-item-icon text-indigo-600" />
                }
                placeholder="Password"
                className="rounded-lg px-4 py-2"
              />
            </Form.Item>

            <Form.Item
              name="confirm"
              dependencies={["password"]}
              hasFeedback
              rules={[
                { required: true, message: "Please confirm your password!" },
                { validator: validateConfirmPassword },
              ]}
            >
              <Input.Password
                prefix={
                  <LockOutlined className="site-form-item-icon text-indigo-600" />
                }
                placeholder="Confirm Password"
                className="rounded-lg px-4 py-2"
              />
            </Form.Item>
            <ButtonDivideStudentAndInstructor onSelectRole={handleRoleSelection} />
            {role === "instructor" && <RegisterInfoOfInstructor />}
            <Form.Item>
              <Button
                type="primary"
                htmlType="submit"
                className="w-full rounded-lg bg-gradient-to-r from-indigo-600 to-purple-600 py-3 text-lg font-semibold text-white shadow-md transition-all duration-300 hover:from-indigo-700 hover:to-purple-700"
              >
                Register
              </Button>
            </Form.Item>
          </Form>
          <Divider plain className="text-gray-400">
            Already have an account?
          </Divider>
          <div className="text-center">
            <Link
              to="/login"
              className="font-semibold text-indigo-600 transition-colors duration-300 hover:text-indigo-800"
            >
              Sign in
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RegisterPage;
