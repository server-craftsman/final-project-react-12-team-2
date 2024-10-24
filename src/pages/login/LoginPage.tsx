import { Link } from "react-router-dom";
import { Form, Input, Button, Divider } from "antd";
import { UserOutlined, LockOutlined, HomeOutlined, EyeInvisibleOutlined, EyeTwoTone } from "@ant-design/icons";
import { GoogleOAuthProvider } from "@react-oauth/google";
import LoginGoogle from "./LoginGoogle";
import { useState } from "react";
import { useAuth } from "../../contexts/AuthContext";
import { AuthService } from "../../services/authentication/auth.service";
import loginAnimation from "../../data/loginAnimation.json";
import Lottie from 'lottie-react'; 
// import { store } from "../../app/store";
// import { UserRole } from "../../models/User"; // Ensure this import is correct
import { CLIENT_ID } from "../../const/authentication";
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
// import { UserRole } from "../../models/User";
import { useNavigate } from "react-router-dom"; // Add this import

const LoginPage = () => {
  const [loginError, setLoginError] = useState<string | null>(null);
  const [showPassword, setShowPassword] = useState<boolean>(false);
  const { handleLogin } = useAuth(); // Update this line to use handleLogin instead of setRole
  const navigate = useNavigate(); // Add this hook

  const getDefaultPath = (userRole: string) => {
    switch (userRole) {
      case 'admin':
        return '/admin';
      case 'instructor':
        return '/instructor';
      case 'student':
        return '/student';
      default:
        return '/';
    }
  };

  const onFinish = async (values: any) => {
    try {
      const result = await AuthService.login({
        email: values.username,
        password: values.password,
      });

      if (result.data?.data?.token) {
        const token = result.data.data.token;
        
        // Use handleLogin from AuthContext
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
          style: { backgroundColor: "#1a237e" }
        });

        // Navigate based on role from localStorage since it's just been set by handleLogin
        const userRole = localStorage.getItem("role");
        const defaultPath = getDefaultPath(userRole || '');
        navigate(defaultPath, { replace: true });
      }
    } catch (error) {
      setLoginError("Login failed. Please check your credentials.");
      console.error("Login error:", error);
    }
  };

  // const validatePassword = (_: any, value: string) => {
  //   const hasUpperCase = /[A-Z]/.test(value);
  //   const hasNumber = /\d/.test(value);
  //   const hasSpecialChar = /[!@#$%^&*(),.?":{}|<>]/.test(value); // Added special character validation
  //   if (
  //     !value ||
  //     value.length < 8 ||
  //     !hasUpperCase ||
  //     !hasNumber ||
  //     !hasSpecialChar
  //   ) {
  //     return Promise.reject(
  //       new Error(
  //         "Password must be at least 8 characters long, contain at least one uppercase letter, one number, and one special character.",
  //       ),
  //     );
  //   }
  //   return Promise.resolve();
  // };

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

  const handleGoogleLoginError = (error: string) => {
    setLoginError(error);
    console.error("Google Login Error:", error);
  };

  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-gradient-to-r from-[#1a237e]/20 to-[#1a237e]/40 backdrop-blur-md">
      <ToastContainer />
      <div className="relative flex w-full max-w-5xl flex-col overflow-hidden rounded-2xl bg-white shadow-2xl md:flex-row">
        <div className="flex w-full flex-col items-center justify-center bg-gradient-to-br from-[#1a237e] to-[#1a237e]/80 p-12 md:w-1/2">
          <Link to="/">
            <Lottie animationData={loginAnimation} loop={true} />
          </Link>
          <h2 className="text-white text-4xl font-extrabold">Edu Learn</h2>
          <p className="mt-4 text-center text-white text-lg">
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
            <h2 className="text-4xl font-extrabold text-[#1a237e]">Welcome Back</h2>
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
              rules={[
                {
                  required: true,
                  message: "Please input your Username or Email!",
                },
                { validator: validateUsername },
              ]}
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
              rules={[
                { required: true, message: "Please input your Password!" },
              ]}
            >
              <Input
                prefix={
                  <LockOutlined className="site-form-item-icon text-indigo-600" />
                }
                type={showPassword ? "text" : "password"} // Toggle input type
                placeholder="Password"
                className="rounded-lg px-4 py-2"
                suffix={
                  showPassword ? (
                    <EyeTwoTone
                      onClick={() => setShowPassword(!showPassword)} // Toggle showPassword state
                      className="text-indigo-600 cursor-pointer"
                    />
                  ) : (
                    <EyeInvisibleOutlined
                      onClick={() => setShowPassword(!showPassword)} // Toggle showPassword state
                      className="text-indigo-600 cursor-pointer"
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
            <GoogleOAuthProvider
              clientId={CLIENT_ID}
              onScriptLoadError={() =>
                console.error("Google script failed to load")
              }
            >
              <Form.Item>
                <LoginGoogle onLoginError={handleGoogleLoginError} />
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
                <Link
                  to="/register"
                  className="font-semibold text-[#1a237e] transition-colors duration-300 hover:text-[#1a237e]/80"
                >
                  Create an Account
                </Link>
              </div>
            </Form.Item>
          </Form>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
