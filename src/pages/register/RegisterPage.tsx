import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Form, Input, Button, Typography, Divider } from "antd";
import { UserOutlined, MailOutlined, LockOutlined, HomeOutlined } from "@ant-design/icons";
import { GoogleOAuthProvider } from "@react-oauth/google";
import { CLIENT_ID } from "../../const/authentication";
import LoginGoogle from "../../pages/login/LoginGoogle";
import registerAnimation from "../../data/registerAnimation.json";
import Lottie from "lottie-react";
import ButtonDivideStudentAndInstructor from "../../components/generic/register/ButtonDivideStudentAndInstructor";
import RegisterInfoOfInstructor from "../../components/generic/register/RegisterInfoOfInstructor";
const { Title, Text } = Typography;


//call api to register
import { useAuth } from "../../contexts/AuthContext";
import { RegisterParams } from "../../models/api/request/authentication/auth.request.model";
// import { ResponseSuccess } from "../../app/interface";
// import { HTTP_STATUS } from "../../app/enums";
import { ROUTER_URL } from "../../const/router.path";
import { HttpException } from "../../app/exceptions";
import { helpers } from "../../utils";
import { UserRoles } from "../../app/enums";

const RegisterPage = () => {
  const [form] = Form.useForm();
  const [role, setRole] = useState<string | null>(null);
  const { register } = useAuth();
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);

  const onFinish = async (values: any) => {
    setIsLoading(true);
    try {
      if (!role) {
        helpers.notification("Please select a role");
        return;
      }

      const params: RegisterParams = {
        name: values.name,
        email: values.email,
        password: values.password,
        role: role as UserRoles,
        description: values.description,
        avatar_url: values.avatar_url,
        phone_number: values.phone_number,
        video_url: values.video_url,
        bank_account_name: values.bank_account_name,
        bank_account_no: values.bank_account_no,
        bank_name: values.bank_name,
      };
      const response = await register(params);
      
      if (response.data) {
        const message = params.role === 'instructor' 
          ? "Registration successful! Please wait for admin review."
          : "Registration successful! Please check your email to verify your account.";
        
        helpers.notification(message);
        navigate(ROUTER_URL.LOGIN);
      }


    } catch (error: any) {
      const errorMessage = error instanceof HttpException 
        ? error.message 
        : error.response?.data?.message ?? "Registration failed. Please try again.";
      
      helpers.notification(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  const handleRoleSelection = (selectedRole: string) => {
    setRole(selectedRole);
  };

  // const validateUsername = (_: any, value: string) => {
  //   if (!value || value.includes(" ") || value.length < 6) {
  //     return Promise.reject(new Error("Username must be at least 6 characters long and contain no spaces."));
  //   }
  //   return Promise.resolve();
  // };

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
    if (!value || value.length < 8 || !hasUpperCase || !hasNumber || !hasSpecialChar) {
      return Promise.reject(new Error("Password must be at least 8 characters long, contain at least one uppercase letter, one number, and one special character."));
    }
    return Promise.resolve();
  };

  const validateConfirmPassword = (_: any, value: string) => {
    if (!value || value !== form.getFieldValue("password")) {
      return Promise.reject(new Error("The two passwords that you entered do not match!"));
    }
    return Promise.resolve();
  };

  const onFinishGoogle = (googleIdToken: string) => {
    console.log("Google ID Token: ", googleIdToken);
  };

  const handleGoogleLoginError = (error: string) => {
    console.error("Google Login Error: ", error);
  };

  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-gradient-to-r from-purple-900/20 to-indigo-900/20 backdrop-blur-md">
      <div className="relative flex w-full max-w-5xl flex-col overflow-hidden rounded-2xl bg-white shadow-2xl md:flex-row">
        <div className="flex w-full flex-col items-center justify-center bg-gradient-to-br from-indigo-900 to-purple-900 p-12 md:w-1/2">
          <Link to="/">
            <Lottie animationData={registerAnimation} loop={true} />
          </Link>
          <h2 className="text-3xl font-bold text-white">Edu Learn</h2>
          <Text className="mt-4 text-center text-lg text-white">Elevate Your Learning Experience</Text>
        </div>
        <div className="w-full bg-gradient-to-br from-white to-gray-100 p-12 md:w-1/2">
          <Link to="/" className="mb-8 flex items-center text-lg text-indigo-600 transition-colors duration-300 hover:text-indigo-800">
            <HomeOutlined className="mr-2" />
            Back to Home
          </Link>
          <Title level={2} className="mb-8 text-indigo-900">
            Create an Account
          </Title>

          <Form form={form} name="register" onFinish={onFinish} scrollToFirstError layout="vertical">
            {/* <Form.Item name="username" rules={[{ required: true, message: "Please input your username!" }, { validator: validateUsername }]}>
              <Input prefix={<UserOutlined className="site-form-item-icon text-indigo-600" />} placeholder="Username" className="rounded-lg px-4 py-2" />
            </Form.Item> */}
            <Form.Item name="name" rules={[{ required: true, message: "Please input your name!" }]}>
              <Input prefix={<UserOutlined className="site-form-item-icon text-indigo-600" />} placeholder="Name" className="rounded-lg px-4 py-2" />
            </Form.Item>

            <Form.Item name="email" rules={[{ required: true, message: "Please input your E-mail!" }, { validator: validateEmail }]}>
              <Input prefix={<MailOutlined className="site-form-item-icon text-indigo-600" />} placeholder="Email" className="rounded-lg px-4 py-2" />
            </Form.Item>

            <Form.Item name="password" rules={[{ required: true, message: "Please input your password!" }, { validator: validatePassword }]} hasFeedback>
              <Input.Password prefix={<LockOutlined className="site-form-item-icon text-indigo-600" />} placeholder="Password" className="rounded-lg px-4 py-2" />
            </Form.Item>

            <Form.Item name="confirm" dependencies={["password"]} hasFeedback rules={[{ required: true, message: "Please confirm your password!" }, { validator: validateConfirmPassword }]}>
              <Input.Password prefix={<LockOutlined className="site-form-item-icon text-indigo-600" />} placeholder="Confirm Password" className="rounded-lg px-4 py-2" />
            </Form.Item>
            <ButtonDivideStudentAndInstructor onSelectRole={handleRoleSelection} />
            {role === "instructor" && <RegisterInfoOfInstructor />}
            <Form.Item>
              <Button 
                loading={isLoading}
                type="primary" 
                htmlType="submit" 
                className="w-full rounded-lg bg-gradient-to-r from-indigo-600 to-purple-600 py-3 text-lg font-semibold text-white shadow-md transition-all duration-300 hover:from-indigo-700 hover:to-purple-700"
              >
                Register
              </Button>
            </Form.Item>
            <GoogleOAuthProvider clientId={CLIENT_ID}>
              <LoginGoogle onLoginSuccess={onFinishGoogle} onLoginError={handleGoogleLoginError} />
            </GoogleOAuthProvider>
          </Form>
          <Divider plain className="text-gray-400">
            Already have an account?
          </Divider>
          <div className="text-center">
            <Link to="/login" className="font-semibold text-indigo-600 transition-colors duration-300 hover:text-indigo-800">
              Sign in
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RegisterPage;
