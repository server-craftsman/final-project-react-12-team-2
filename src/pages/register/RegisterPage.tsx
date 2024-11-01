import { useState, useCallback, useMemo } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Form, Input, Typography, Divider, Modal } from "antd";
import { UserOutlined, MailOutlined, LockOutlined, HomeOutlined } from "@ant-design/icons";
import { GoogleOAuthProvider } from "@react-oauth/google";
import { CLIENT_ID } from "../../const/authentication";
import LoginGoogle from "../google/GoogleModal";
import registerAnimation from "../../data/registerAnimation.json";
import Lottie from "lottie-react";
import ButtonDivideStudentAndInstructor from "../../components/generic/register/ButtonDivideStudentAndInstructor";
import RegisterInfoOfInstructor from "../../components/generic/register/RegisterInfoOfInstructor";
import RegisterViaGoogle from "./RegisterViaGoogle";
const { Title, Text } = Typography;
import { handleUploadFile } from "../../utils/upload";
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
  const [isGoogleModalVisible, setIsGoogleModalVisible] = useState(false);
  const [googleId, setGoogleId] = useState<string>("");

  const getRegistrationSuccessMessage = useCallback((role: UserRoles) => {
    return role === "instructor" ? "Register as instructor successfully. Waiting Admin for approval..." : "Register as student successfully";
  }, []);

  const getErrorMessage = useCallback((error: any) => {
    return error instanceof HttpException ? error.message : "An error occurred during registration. Please try again.";
  }, []);

  const handleRoleSelection = useCallback((selectedRole: string) => {
    setRole(selectedRole);
  }, []);

  const validateEmail = useCallback(async (_: any, value: string) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!value || !emailRegex.test(value)) {
      return Promise.reject(new Error("Please enter a valid email address."));
    }
    return Promise.resolve();
  }, []);

  const validatePassword = useCallback(async (_: any, value: string) => {
    const hasUpperCase = /[A-Z]/.test(value);
    const hasNumber = /\d/.test(value);
    const hasSpecialChar = /[!@#$%^&*(),.?":{}|<>]/.test(value);
    if (!value || value.length < 8 || !hasUpperCase || !hasNumber || !hasSpecialChar) {
      return Promise.reject(new Error("Password must be at least 8 characters long, contain at least one uppercase letter, one number, and one special character."));
    }
    return Promise.resolve();
  }, []);

  const validateConfirmPassword = useCallback(
    ({ getFieldValue }: any) => ({
      validator(_: any, value: string) {
        if (!value || getFieldValue("password") === value) {
          return Promise.resolve();
        }
        return Promise.reject(new Error("The two passwords that you entered do not match!"));
      }
    }),
    []
  );

  const onFinish = useCallback(
    async (values: any) => {
      if (!role) {
        helpers.notification("Please select a role");
        return;
      }

      setIsLoading(true);
      try {
        const params: RegisterParams = {
          name: values.name || "",
          email: values.email || "",
          password: values.password || "",
          role: role as UserRoles,
          description: "",
          avatar_url: "",
          phone_number: "",
          video_url: "",
          bank_account_name: "",
          bank_account_no: "",
          bank_name: ""
        };

        if (role === "instructor") {
          const requiredFields = ["phone_number", "description", "bank_account_name", "bank_account_no", "bank_name"];
          const missingFields = requiredFields.filter((field) => !values[field]);

          if (missingFields.length > 0) {
            throw new Error(`Please fill in all required fields: ${missingFields.join(", ")}`);
          }

          Object.assign(params, {
            description: values.description,
            phone_number: values.phone_number,
            bank_account_name: values.bank_account_name,
            bank_account_no: values.bank_account_no,
            bank_name: values.bank_name
          });

          const avatarFile = form.getFieldValue("avatar_file")?.originFileObj;
          const videoFile = form.getFieldValue("video_file")?.originFileObj;

          if (!avatarFile || !videoFile) {
            throw new Error("Please upload both avatar and video files");
          }

          const timeout = 5 * 60 * 1000;

          const uploadWithTimeout = async (promise: Promise<any>) => {
            return Promise.race([promise, new Promise((_, reject) => setTimeout(() => reject(new Error("Upload timed out - file may be too large")), timeout))]);
          };

          try {
            const [avatarUrl, videoUrl] = await Promise.all([uploadWithTimeout(handleUploadFile(avatarFile, "image")), uploadWithTimeout(handleUploadFile(videoFile, "video"))]);

            params.avatar_url = avatarUrl;
            params.video_url = videoUrl;
          } catch (uploadError: any) {
            throw new Error(`File upload failed: ${uploadError.message}. Please try with smaller files or check your connection.`);
          }
        }

        await register(params);
        helpers.notification(getRegistrationSuccessMessage(params.role));
        navigate(ROUTER_URL.LOGIN);
      } catch (error: any) {
        helpers.notification(getErrorMessage(error));
      } finally {
        setIsLoading(false);
      }
    },
    [role, register, navigate, form, getRegistrationSuccessMessage, getErrorMessage]
  );

  const onFinishGoogle = useCallback((token: string) => {
    setGoogleId(token);
    setIsGoogleModalVisible(true);
  }, []);

  const handleGoogleLoginError = useCallback((error: string) => {
    console.error("Google Login Error: ", error);
  }, []);

  const handleModalClose = useCallback(() => {
    setIsGoogleModalVisible(false);
  }, []);

  const formRules = useMemo(
    () => ({
      name: [{ required: true, message: "Please input your name!" }],
      email: [{ required: true, message: "Please input your E-mail!" }, { validator: validateEmail }],
      password: [{ required: true, message: "Please input your password!" }, { validator: validatePassword }],
      confirm: [{ required: true, message: "Please confirm your password!" }, validateConfirmPassword]
    }),
    [validateEmail, validatePassword, validateConfirmPassword]
  );

  const renderLeftPanel = useMemo(
    () => (
      <div className="flex w-full flex-col items-center justify-center bg-gradient-tone p-12 md:w-1/2">
        <Link to="/">
          <Lottie animationData={registerAnimation} loop={true} />
        </Link>
        <h2 className="text-3xl font-bold text-white">Edu Learn</h2>
        <Text className="mt-4 text-center text-lg text-white">Elevate Your Learning Experience</Text>
      </div>
    ),
    []
  );

  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-gradient-tone/90 backdrop-blur-md">
      <div className="relative flex w-full max-w-[85rem] flex-col overflow-hidden rounded-2xl bg-white shadow-2xl md:flex-row">
        {renderLeftPanel}
        <div className="w-full bg-gradient-to-br from-white to-gray-100 p-12 md:w-1/2">
          <Link to="/" className="mb-8 flex items-center text-lg btn-text">
            <HomeOutlined className="mr-2" />
            Back to Home
          </Link>
          <Title level={2} className="mb-8 text-[#161d66]">
            Create an Account
          </Title>

          <Form form={form} name="register" onFinish={onFinish} scrollToFirstError layout="vertical">
            <Form.Item name="name" rules={formRules.name}>
              <Input prefix={<UserOutlined className="site-form-item-icon text-indigo-600" />} placeholder="Name" className="rounded-lg px-4 py-2" />
            </Form.Item>

            <Form.Item name="email" rules={formRules.email}>
              <Input prefix={<MailOutlined className="site-form-item-icon text-indigo-600" />} placeholder="Email" className="rounded-lg px-4 py-2" />
            </Form.Item>

            <Form.Item name="password" rules={formRules.password} hasFeedback>
              <Input.Password prefix={<LockOutlined className="site-form-item-icon text-indigo-600" />} placeholder="Password" className="rounded-lg px-4 py-2" />
            </Form.Item>

            <Form.Item name="confirm" dependencies={["password"]} hasFeedback rules={formRules.confirm}>
              <Input.Password prefix={<LockOutlined className="site-form-item-icon text-indigo-600" />} placeholder="Confirm Password" className="rounded-lg px-4 py-2" />
            </Form.Item>
            <ButtonDivideStudentAndInstructor onSelectRole={handleRoleSelection} />
            {role === "instructor" && <RegisterInfoOfInstructor form={form} uploadingVideo={uploadingVideo} uploadingAvatar={uploadingAvatar} setUploadingVideo={setUploadingVideo} setUploadingAvatar={setUploadingAvatar} />}
            <div className="mt-4">
              <button 
                type="submit"
                className="bg-btn-submit"
                disabled={isLoading}
              >
                {isLoading ? "Registering..." : "Register"}
              </button>
            </div>
            <Divider plain className="text-gray-400">
              Or
            </Divider>
            <div className="flex justify-center">
              <GoogleOAuthProvider clientId={CLIENT_ID}>
                <LoginGoogle onLoginSuccess={onFinishGoogle} onLoginError={handleGoogleLoginError} context="register" />
              </GoogleOAuthProvider>
            </div>
          </Form>
          <div className="mt-4 text-center">
            Already have an account?{" "}
            <Link to="/login" className="font-semibold btn-text">
              Sign in
            </Link>
          </div>
        </div>
      </div>

      <Modal title="Register via Google" open={isGoogleModalVisible} onCancel={handleModalClose} footer={null} width={1200}>
        <RegisterViaGoogle googleId={googleId} />
      </Modal>
    </div>
  );
};

export default RegisterPage;
