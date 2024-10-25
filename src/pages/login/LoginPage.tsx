import { Link } from "react-router-dom";
import { Form, Input, Button, Divider, Modal } from "antd";
import {
  UserOutlined,
  LockOutlined,
  HomeOutlined,
  EyeInvisibleOutlined,
  EyeTwoTone,
} from "@ant-design/icons";
import { GoogleOAuthProvider } from "@react-oauth/google";
import LoginGoogle from "./LoginGoogle";
import { useState } from "react";
import { useAuth } from "../../contexts/AuthContext";
import { AuthService } from "../../services/authentication/auth.service";
import loginAnimation from "../../data/loginAnimation.json";
import Lottie from "lottie-react";
import { CLIENT_ID } from "../../const/authentication";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { useNavigate } from "react-router-dom";
import SignUpForm from "./SignUpGoogle";
import { ROUTER_URL } from "../../const/router.path";
import { HTTP_STATUS } from "../../app/enums";
import { HttpException } from "../../app/exceptions";
import { validation } from "../../utils";

import {
  RegisterStudentPublicParams,
  RegisterInstructorPublicParams,
} from "../../models/api/request/authentication/auth.request.model";

const LoginPage = () => {
  const [loginError, setLoginError] = useState<string | null>(null);
  const [showPassword, setShowPassword] = useState<boolean>(false);
  const [googleIdToken, setGoogleIdToken] = useState<string | null>(null);
  const [isSignUpModalVisible, setIsSignUpModalVisible] =
    useState<boolean>(false);
  const { handleLogin, registerGooglePublic } = useAuth();
  const navigate = useNavigate();

  const getDefaultPath = (userRole: string) => {
    switch (userRole) {
      case "admin":
        return ROUTER_URL.ADMIN.BASE;
      case "instructor":
        return ROUTER_URL.INSTRUCTOR.BASE;
      case "student":
        return ROUTER_URL.STUDENT.BASE;
      default:
        return ROUTER_URL.COMMON.HOME;
    }
  };

  const onFinish = async (values: any) => {
    try {
      const result = await AuthService.login({
        email: values.username,
        password: values.password,
      });

      if (result.status === HTTP_STATUS.OK && result.data?.data?.token) {
        const token = result.data.data.token;
        await handleLogin(token);

        toast.success("Login Success", {
          position: "top-right",
          autoClose: 5000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
          theme: "colored",
          style: { backgroundColor: "#1a237e" },
        });

        const userRole = localStorage.getItem("role");
        const defaultPath = getDefaultPath(userRole || "");
        if (typeof defaultPath === "string") {
          navigate(defaultPath);
        } else {
          console.error("Invalid path:", defaultPath);
        }
      }
    } catch (error) {
      if (error instanceof HttpException) {
        setLoginError(error.message);
      } else {
        setLoginError("An unexpected error occurred. Please try again later.");
      }
      console.error("Login error:", error);
    }
  };

  const onFinishGoogle = async (googleId: string) => {
    try {
      const result = await AuthService.loginGoogle({ google_id: googleId });
      if (result.status === HTTP_STATUS.OK && result.data?.data?.token) {
        const token = result.data.data.token;
        localStorage.setItem("token", token);
        await handleLogin(token);

        const userRole = localStorage.getItem("role");
        const defaultPath = getDefaultPath(userRole || "");
        if (typeof defaultPath === "string") {
          navigate(defaultPath);
        } else {
          console.error("Invalid path:", defaultPath);
        }
      }
    } catch (error) {
      if (error instanceof HttpException) {
        if (error.message.includes("is not exists")) {
          setLoginError("Your email is not registered. Please sign up.");
          setIsSignUpModalVisible(true);
        } else {
          setLoginError(error.message);
        }
      } else {
        setLoginError("An unexpected error occurred. Please try again later.");
      }
      console.error("Login error:", error);
    }
  };

  // const verifyToken = async (token: string) => {
  //   try {
  //     const result = await AuthService.verifyToken(token);
  //     console.log("Verify token result:", result);
  //   } catch (error) {
  //     console.error("Verify token error:", error);
  //   }
  // }

  const validateUsername = (_: any, value: string) => {
    if (!value) {
      return Promise.reject(new Error("Please input your email!"));
    }
    if (!validation.checkValidEmail(value)) {
      return Promise.reject(new Error("Please enter a valid email address!"));
    }
    return Promise.resolve();
  };

  const validatePassword = (_: any, value: string) => {
    if (!value) {
      return Promise.reject(new Error("Please input your password!"));
    }
    // if (!validation.checkValidPassword(value)) {
    //   return Promise.reject(
    //     new Error(
    //       "Password must be at least 8 characters long and contain at least one uppercase letter, one lowercase letter, one number, and one special character"
    //     )
    //   );
    // }
    return Promise.resolve();
  };

  const handleGoogleLoginError = (error: string) => {
    setLoginError(error);
    console.error("Google Login Error:", error);
  };

  // const handleGoogleLoginSuccess = async (idToken: string) => {
  //   console.log("Google ID Token received:", idToken);
  //   setGoogleIdToken(idToken);
  //   setIsSignUpModalVisible(true);

  //   try {
  //     // Register the user with the Google ID token
  //     const result = await registerGooglePublic({ google_id: idToken } as RegisterStudentPublicParams | RegisterInstructorPublicParams);
  //     // Check if the response contains a token
  //     const token = result?.data?.token; // Adjust this line based on actual response
  //     if (token) {
  //       localStorage.setItem("token", token);
  //       await handleLogin(token);

  //       // Verify the token
  //       await verifyToken(token);

  //       const userRole = localStorage.getItem("role");
  //       const defaultPath = getDefaultPath(userRole || '');
  //       if (typeof defaultPath === 'string') {
  //         navigate(defaultPath);
  //       } else {
  //         console.error("Invalid path:", defaultPath);
  //       }
  //     } else {
  //       console.error("Token not found in response:", result.data);
  //       // Handle the case where the token is not present
  //     }
  //   } catch (error) {
  //     console.error("Token verification failed:", error);
  //   }
  // };

  // const showSignUpModal = () => {
  //   setIsSignUpModalVisible(true);
  // };

  const handleSignUpModalCancel = () => {
    setIsSignUpModalVisible(false);
  };

  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-gradient-to-r from-[#1a237e]/20 to-[#1a237e]/40 backdrop-blur-md">
      <ToastContainer />
      <div className="relative flex w-full max-w-5xl flex-col overflow-hidden rounded-2xl bg-white shadow-2xl md:flex-row">
        <div className="flex w-full flex-col items-center justify-center bg-gradient-to-br from-[#1a237e] to-[#1a237e]/80 p-12 md:w-1/2">
          <Link to="/">
            <Lottie animationData={loginAnimation} loop={true} />
          </Link>
          <h2 className="text-4xl font-extrabold text-white">Edu Learn</h2>
          <p className="mt-4 text-center text-lg text-white">
            Elevate Your Learning Experience
          </p>
        </div>
        <div className="w-full bg-gradient-to-br from-white to-gray-100 p-12 md:w-1/2">
          <Link
            to="/"
            className="mb-8 flex items-center text-lg text-[#1a237e] transition-colors duration-300 hover:text-[#1a237e]/80"
          >
            <HomeOutlined className="mr-2" />
            Back to Home
          </Link>
          <div className="mb-8">
            <h2 className="text-4xl font-extrabold text-[#1a237e]">
              Welcome Back
            </h2>
            <p className="mt-2 text-gray-600">Please sign in to your account</p>
          </div>
          <Form
            name="normal_login"
            className="login-form"
            initialValues={{ remember: true }}
            onFinish={onFinish}
          >
            <Form.Item
              name="username"
              rules={[{ validator: validateUsername }]}
            >
              <Input
                prefix={
                  <UserOutlined className="site-form-item-icon text-[#1a237e]" />
                }
                placeholder="Username or Email"
                className="rounded-lg px-4 py-2"
              />
            </Form.Item>
            <Form.Item
              name="password"
              rules={[{ validator: validatePassword }]}
            >
              <Input
                prefix={
                  <LockOutlined className="site-form-item-icon text-indigo-600" />
                }
                type={showPassword ? "text" : "password"}
                placeholder="Password"
                className="rounded-lg px-4 py-2"
                suffix={
                  showPassword ? (
                    <EyeTwoTone
                      onClick={() => setShowPassword(!showPassword)}
                      className="cursor-pointer text-indigo-600"
                    />
                  ) : (
                    <EyeInvisibleOutlined
                      onClick={() => setShowPassword(!showPassword)}
                      className="cursor-pointer text-indigo-600"
                    />
                  )
                }
              />
            </Form.Item>
            <Form.Item>
              <Link
                className="login-form-forgot text-sm text-indigo-600 transition-colors duration-300 hover:text-indigo-800"
                to="/forgot-password"
              >
                Forgot password?
              </Link>
            </Form.Item>

            <Form.Item>
              <Button
                type="primary"
                htmlType="submit"
                className="login-form-button w-full rounded-lg bg-gradient-to-r from-[#1a237e] to-[#1a237e]/80 py-3 text-lg font-semibold text-white shadow-md transition-all duration-300 hover:from-[#1a237e]/90 hover:to-[#1a237e]/70"
              >
                Sign In
              </Button>
            </Form.Item>

            <Divider plain className="text-gray-400">
              or continue with
            </Divider>
            <GoogleOAuthProvider clientId={CLIENT_ID}>
              <Form.Item>
                <LoginGoogle
                  onLoginError={handleGoogleLoginError}
                  onLoginSuccess={onFinishGoogle}
                />
              </Form.Item>
            </GoogleOAuthProvider>

            {loginError && (
              <p className="mt-4 text-center text-red-500">
                {loginError}
                {loginError.includes("ERR_BLOCKED_BY_CLIENT") && (
                  <span>
                    {" "}
                    This may be due to ad-blocking or privacy protection
                    software. Please disable these and try again.
                  </span>
                )}
              </p>
            )}

            <Form.Item>
              <div className="text-center">
                <span className="text-gray-600">New to Edu Learn? </span>
                <Button
                  type="link"
                  className="font-semibold text-[#1a237e] transition-colors duration-300 hover:text-[#1a237e]/80"
                  // onClick={showSignUpModal}
                  onClick={() => navigate("/register")}
                >
                  Create an Account
                </Button>
              </div>
            </Form.Item>
          </Form>
        </div>
      </div>

      <Modal
        title="Sign Up"
        open={isSignUpModalVisible}
        onCancel={handleSignUpModalCancel}
        footer={null}
      >
        <SignUpForm googleIdToken={googleIdToken} />
      </Modal>
    </div>
  );
};

export default LoginPage;
