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
import { handleUploadFile } from "../../utils/upload";

// Call API to register
import { useAuth } from "../../contexts/AuthContext";
import { RegisterParams } from "../../models/api/request/authentication/auth.request.model";
import { ROUTER_URL } from "../../const/router.path";
import { HttpException } from "../../app/exceptions";
import { helpers } from "../../utils";
import { UserRoles } from "../../app/enums";

const RegisterPage = () => {
  const [form] = Form.useForm();
  const [role, setRole] = useState<string>("student");
  const { register } = useAuth();
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);
  const [uploadingVideo, setUploadingVideo] = useState(false);
  const [uploadingAvatar, setUploadingAvatar] = useState(false);

  const onFinish = async (values: any) => {
    setIsLoading(true);
    try {
      if (!role) {
        helpers.notification("Please select a role");
        setIsLoading(false);
        return;
      }

      // Validate form fields
      await form.validateFields();

      // Upload avatar file
      const avatarFile = form.getFieldValue('avatar_file')?.originFileObj;
      const avatarUrl = avatarFile ? await handleUploadFile(avatarFile, 'avatar') : null;
      if (!avatarUrl) {
        helpers.notification("Failed to upload avatar. Please try again.");
        setIsLoading(false);
        return;
      }

      // Upload video file
      const videoFile = form.getFieldValue('video_file')?.originFileObj;
      const videoUrl = videoFile ? await handleUploadFile(videoFile, 'video') : null;
      if (!videoUrl) {
        helpers.notification("Failed to upload video. Please try again.");
        setIsLoading(false);
        return;
      }

      // Prepare registration parameters
      const params: RegisterParams = {
        name: values.name,
        email: values.email,
        password: values.password,
        role: role as UserRoles,
        description: values.description,
        avatar_url: avatarUrl,
        phone_number: values.phone_number,
        video_url: videoUrl,
        bank_account_name: values.bank_account_name,
        bank_account_no: values.bank_account_no,
        bank_name: values.bank_name
      };

      // Call register API
      const response = await register(params);

      if (response.data) {
        const message = params.role === "instructor" 
          ? "Registration successful! Please wait for admin review." 
          : "Registration successful! Please check your email to verify your account.";

        helpers.notification(message);
        navigate(ROUTER_URL.LOGIN);
      }
    } catch (error: any) {
      const errorMessage = error instanceof HttpException 
        ? error.message 
        : (error.response?.data?.message ?? "Registration failed. Please try again.");

      helpers.notification(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  const handleRoleSelection = (selectedRole: string) => {
    setRole(selectedRole);
  };

  const validateEmail = async (_: any, value: string) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!value || !emailRegex.test(value)) {
      return Promise.reject(new Error("Please enter a valid email address."));
    }
    return Promise.resolve();
  };

  const validatePassword = async (_: any, value: string) => {
    const hasUpperCase = /[A-Z]/.test(value);
    const hasNumber = /\d/.test(value);
    const hasSpecialChar = /[!@#$%^&*(),.?":{}|<>]/.test(value);
    if (!value || value.length < 8 || !hasUpperCase || !hasNumber || !hasSpecialChar) {
      return Promise.reject(new Error("Password must be at least 8 characters long, contain at least one uppercase letter, one number, and one special character."));
    }
    return Promise.resolve();
  };

  const validateConfirmPassword = ({ getFieldValue }: any) => ({
    validator(_: any, value: string) {
      if (!value || getFieldValue('password') === value) {
        return Promise.resolve();
      }
      return Promise.reject(new Error('The two passwords that you entered do not match!'));
    },
  });

  const onFinishGoogle = (googleIdToken: string) => {
    console.log("Google ID Token: ", googleIdToken);
  };

  const handleGoogleLoginError = (error: string) => {
    console.error("Google Login Error: ", error);
  };

  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-gradient-to-r from-purple-900/20 to-indigo-900/20 backdrop-blur-md">
      <div className="relative flex w-full max-w-[85rem] flex-col overflow-hidden rounded-2xl bg-white shadow-2xl md:flex-row">
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
            <Form.Item name="name" rules={[{ required: true, message: "Please input your name!" }]}>
              <Input prefix={<UserOutlined className="site-form-item-icon text-indigo-600" />} placeholder="Name" className="rounded-lg px-4 py-2" />
            </Form.Item>

            <Form.Item name="email" rules={[{ required: true, message: "Please input your E-mail!" }, { validator: validateEmail }]}>
              <Input prefix={<MailOutlined className="site-form-item-icon text-indigo-600" />} placeholder="Email" className="rounded-lg px-4 py-2" />
            </Form.Item>

            <Form.Item name="password" rules={[{ required: true, message: "Please input your password!" }, { validator: validatePassword }]} hasFeedback>
              <Input.Password prefix={<LockOutlined className="site-form-item-icon text-indigo-600" />} placeholder="Password" className="rounded-lg px-4 py-2" />
            </Form.Item>

            <Form.Item name="confirm" dependencies={["password"]} hasFeedback rules={[{ required: true, message: "Please confirm your password!" }, validateConfirmPassword]}>
              <Input.Password prefix={<LockOutlined className="site-form-item-icon text-indigo-600" />} placeholder="Confirm Password" className="rounded-lg px-4 py-2" />
            </Form.Item>
            <ButtonDivideStudentAndInstructor onSelectRole={handleRoleSelection} />
            {role === "instructor" && (
              <RegisterInfoOfInstructor
                form={form}
                uploadingVideo={uploadingVideo}
                uploadingAvatar={uploadingAvatar}
                setUploadingVideo={setUploadingVideo}
                setUploadingAvatar={setUploadingAvatar}
              />
            )}
            <Form.Item>
              <Button loading={isLoading} type="primary" htmlType="submit" className="mt-4 w-full h-12 rounded-lg bg-gradient-to-r from-indigo-600 to-purple-600 py-3 text-lg font-semibold text-white shadow-md transition-all duration-300 hover:from-indigo-700 hover:to-purple-700">
                Register
              </Button>
            </Form.Item>
            <Divider plain className="text-gray-400">
              Or
            </Divider>
            <div className="flex justify-center">
              <GoogleOAuthProvider clientId={CLIENT_ID}>
                <LoginGoogle onLoginSuccess={onFinishGoogle} onLoginError={handleGoogleLoginError} />
              </GoogleOAuthProvider>
            </div>
          </Form>
          <div className="text-center mt-4">Already have an account? <Link to="/login" className="font-semibold text-indigo-600 transition-colors duration-300 hover:text-indigo-800">Sign in</Link></div>
        </div>
      </div>
    </div>
  );
};

export default RegisterPage;
