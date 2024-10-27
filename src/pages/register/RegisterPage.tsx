import { useState, useCallback } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Form, Input, Button, Typography, Divider, Modal } from "antd";
import { UserOutlined, MailOutlined, LockOutlined, HomeOutlined } from "@ant-design/icons";
import { GoogleOAuthProvider } from "@react-oauth/google";
import { CLIENT_ID } from "../../const/authentication";
import LoginGoogle from "../google/GoogleModal";
import registerAnimation from "../../data/registerAnimation.json";
import Lottie from "lottie-react";
import ButtonDivideStudentAndInstructor from "../../components/generic/register/ButtonDivideStudentAndInstructor";
import RegisterInfoOfInstructor from "../../components/generic/register/RegisterInfoOfInstructor";
import RegisterViaGoogle from "./RegisterViaGoogle"; // Import the RegisterViaGoogle component
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
  const [isGoogleModalVisible, setIsGoogleModalVisible] = useState(false); // State to control modal visibility
  const [googleId, setGoogleId] = useState<string>(""); // Add state for googleId

  const onFinish = useCallback(async (values: any) => {
    if (!role) {
      helpers.notification("Please select a role");
      return;
    }

    setIsLoading(true);
    try {
      // Prepare registration parameters with default values
      const params: RegisterParams = {
        name: values.name || '',
        email: values.email || '', 
        password: values.password || '',
        role: role as UserRoles,
        description: '',
        avatar_url: '',
        phone_number: '',
        video_url: '',
        bank_account_name: '',
        bank_account_no: '',
        bank_name: ''
      };

      // Only validate and upload files for instructor role
      if (role === 'instructor') {
        // Validate required instructor fields
        const requiredFields = ['phone_number', 'description', 'bank_account_name', 'bank_account_no', 'bank_name'];
        const missingFields = requiredFields.filter(field => !values[field]);
        
        if (missingFields.length > 0) {
          throw new Error(`Please fill in all required fields: ${missingFields.join(', ')}`);
        }

        // Update instructor specific fields
        Object.assign(params, {
          description: values.description,
          phone_number: values.phone_number,
          bank_account_name: values.bank_account_name,
          bank_account_no: values.bank_account_no,
          bank_name: values.bank_name
        });

        // Quick validation of file existence before upload
        const avatarFile = form.getFieldValue('avatar_file')?.originFileObj;
        const videoFile = form.getFieldValue('video_file')?.originFileObj;

        if (!avatarFile || !videoFile) {
          throw new Error('Please upload both avatar and video files');
        }

        // Set longer timeout for large files
        const timeout = 5 * 60 * 1000; // 5 minutes timeout
        
        // Upload files concurrently with timeout
        const uploadWithTimeout = async (promise: Promise<any>) => {
          return Promise.race([
            promise,
            new Promise((_, reject) => 
              setTimeout(() => reject(new Error('Upload timed out - file may be too large')), timeout)
            )
          ]);
        };

        try {
          const [avatarUrl, videoUrl] = await Promise.all([
            uploadWithTimeout(handleFileUpload('avatar_file', 'avatar')),
            uploadWithTimeout(handleFileUpload('video_file', 'video'))
          ]);

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
  }, [role, register, navigate]);

  const handleFileUpload = useCallback(async (fieldName: string, type: 'avatar' | 'video') => {
    const file = form.getFieldValue(fieldName)?.originFileObj;
    if (!file) {
      throw new Error(`Please upload ${type}`);
    }

    try {
      const url = await handleUploadFile(file, type);
      if (!url) {
        throw new Error(`Failed to upload ${type}`);
      }
      return url;
    } catch (error) {
      console.error(`Error uploading ${type}:`, error);
      throw new Error(`Failed to upload ${type}. Please try again.`);
    }
  }, [form]);


  const getRegistrationSuccessMessage = (role: UserRoles) => {
    return role === 'instructor' ? "Register as instructor successfully" : "Register as student successfully";
  };

  const getErrorMessage = (error: any) => {
    return error instanceof HttpException ? error.message : "An error occurred during registration. Please try again.";
  };

  const handleRoleSelection = useCallback((selectedRole: string) => {
    setRole(selectedRole);
  }, []);

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

  const onFinishGoogle = (token: string) => {
    console.log("Google ID Token: ", token);
    setGoogleId(token); // Set the token state
    setIsGoogleModalVisible(true); // Show the modal when Google login is successful
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
                <LoginGoogle 
                  onLoginSuccess={onFinishGoogle} 
                  onLoginError={handleGoogleLoginError} 
                  context="register" // Pass context as "register"
                />
              </GoogleOAuthProvider>
            </div>
          </Form>
          <div className="text-center mt-4">Already have an account? <Link to="/login" className="font-semibold text-indigo-600 transition-colors duration-300 hover:text-indigo-800">Sign in</Link></div>
        </div>
      </div>

      {/* Modal for Google Registration */}
      <Modal
        title="Register via Google"
        open={isGoogleModalVisible}
        onCancel={() => setIsGoogleModalVisible(false)}
        footer={null}
        width={1200}
      >
        <RegisterViaGoogle googleId={googleId} />
      </Modal>
    </div>
  );
};

export default RegisterPage;
