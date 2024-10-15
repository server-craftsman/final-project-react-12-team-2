import { Link } from "react-router-dom";
import { Form, Input, Button, Divider } from "antd";
import { UserOutlined, LockOutlined, HomeOutlined } from "@ant-design/icons";
import gif from "../../assets/login-bg.gif";
import { CLIENT_ID } from "../../const/authentication";
import { GoogleOAuthProvider } from "@react-oauth/google";
import LoginGoogle from "./LoginGoogle";
import { useState, useContext } from "react";
import { AuthContext } from "../../context/AuthContext";
const LoginPage = () => {
  const { login } = useContext(AuthContext);
  const [loginError, setLoginError] = useState<string | null>(null);

  const onFinish = (values: any) => {
    console.log("Received values of form: ", values);
    const user = login(values.username, values.password);
    if (!user) {
      setLoginError("Invalid username or password.");
    } else {
      console.log("User Role: ", user.role);
    }
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
    <div className="flex min-h-screen flex-col items-center justify-center bg-gradient-to-r from-purple-900/20 to-indigo-900/20 backdrop-blur-md">
      <div className="relative flex w-full max-w-5xl flex-col overflow-hidden rounded-2xl bg-white shadow-2xl md:flex-row">
        <div className="flex w-full flex-col items-center justify-center bg-gradient-to-br from-indigo-900 to-purple-900 p-12 md:w-1/2">
          <Link to="/">
            <img
              src={gif}
              alt="Study"
              className="border-gold mb-8 ml-10 w-4/5 transform rounded-full border-4 shadow-lg transition-transform duration-300 hover:scale-105"
            />
          </Link>
          <h2 className="text-gold text-3xl font-bold">Edu Learn</h2>
          <p className="mt-4 text-center text-white">
            Elevate Your Learning Experience
          </p>
        </div>
        <div className="w-full bg-gradient-to-br from-white to-gray-100 p-12 md:w-1/2">
          <Link
            to="/"
            className="mb-8 flex items-center text-lg text-indigo-600 transition-colors duration-300 hover:text-indigo-800"
          >
            <HomeOutlined className="mr-2" />
            Back to Home
          </Link>
          <div className="mb-8">
            <h2 className="text-4xl font-bold text-indigo-900">Welcome Back</h2>
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
                  <UserOutlined className="site-form-item-icon text-indigo-600" />
                }
                placeholder="Username or Email"
                className="rounded-lg px-4 py-2"
              />
            </Form.Item>
            <Form.Item
              name="password"
              rules={[
                { required: true, message: "Please input your Password!" },
                { validator: validatePassword },
              ]}
            >
              <Input
                prefix={
                  <LockOutlined className="site-form-item-icon text-indigo-600" />
                }
                type="password"
                placeholder="Password"
                className="rounded-lg px-4 py-2"
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
                className="login-form-button w-full rounded-lg bg-gradient-to-r from-indigo-600 to-purple-600 py-3 text-lg font-semibold text-white shadow-md transition-all duration-300 hover:from-indigo-700 hover:to-purple-700"
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
                  className="font-semibold text-indigo-600 transition-colors duration-300 hover:text-indigo-800"
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
