import { Link } from 'react-router-dom';
import { Form, Input, Button, Divider } from 'antd';
import { UserOutlined, LockOutlined, HomeOutlined } from '@ant-design/icons';
import gif from '../../assets/login-bg.gif';
import { CLIENT_ID } from '../../const/authentication';
import { GoogleOAuthProvider } from '@react-oauth/google';
import LoginGoogle from './LoginGoogle';
import { useState } from 'react';

const LoginPage = () => {
  const [loginError, setLoginError] = useState<string | null>(null)

  const onFinish = (values: any) => {
    console.log('Received values of form: ', values);
  };
  
  const validatePassword = (_: any, value: string) => {
    const hasUpperCase = /[A-Z]/.test(value);
    const hasNumber = /\d/.test(value);
    const hasSpecialChar = /[!@#$%^&*(),.?":{}|<>]/.test(value); // Added special character validation
    if (!value || value.length < 8 || !hasUpperCase || !hasNumber || !hasSpecialChar) {
      return Promise.reject(new Error('Password must be at least 8 characters long, contain at least one uppercase letter, one number, and one special character.'));
    }
    return Promise.resolve();
  };

  const validateUsername = (_: any, value: string) => {
    if (!value || value.includes(' ') || value.length < 6) {
      return Promise.reject(new Error('Username must be at least 6 characters long and contain no spaces.'));
    }
    return Promise.resolve();
  };

  const handleGoogleLoginError = (error: string) => {
    setLoginError(error);
    console.error("Google Login Error:", error);
  };

  return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-r from-purple-900/20 to-indigo-900/20 backdrop-blur-md">
        <div className="w-full max-w-5xl bg-white shadow-2xl rounded-2xl overflow-hidden flex flex-col md:flex-row relative">

          <div className="w-full md:w-1/2 bg-gradient-to-br from-indigo-900 to-purple-900 p-12 flex flex-col justify-center items-center">
            <Link to="/">
              <img src={gif} alt="Study" className="w-4/5 mb-8 ml-10 rounded-full border-4 border-gold shadow-lg transform hover:scale-105 transition-transform duration-300" />
            </Link>
            <h2 className="text-3xl font-bold text-gold">Edu Learn</h2>
            <p className="text-white text-center mt-4">Elevate Your Learning Experience</p>
          </div>
          <div className="w-full md:w-1/2 p-12 bg-gradient-to-br from-white to-gray-100">
          <Link to="/" className="text-indigo-600 hover:text-indigo-800 transition-colors duration-300 text-lg flex items-center mb-8">
              <HomeOutlined className="mr-2" />
              Back to Home
            </Link>
            <div className="mb-8">
              <h2 className="text-4xl font-bold text-indigo-900">Welcome Back</h2>
              <p className="text-gray-600 mt-2">Please sign in to your account</p>
            </div>
            <Form
              name="normal_login"
              className="login-form"
              initialValues={{ remember: true }}
              onFinish={onFinish}
            >
              <Form.Item
                name="username"
                rules={[{ required: true, message: 'Please input your Username or Email!' },
                  {validator:validateUsername},
                ]}
              >
                <Input prefix={<UserOutlined className="site-form-item-icon text-indigo-600" />} placeholder="Username or Email" className="py-2 px-4 rounded-lg" />
              </Form.Item>
              <Form.Item
                name="password"
                rules={[{ required: true, message: 'Please input your Password!' },
                  {validator:validatePassword},
                ]}
              >
                <Input
                  prefix={<LockOutlined className="site-form-item-icon text-indigo-600" />}
                  type="password"
                  placeholder="Password"
                  className="py-2 px-4 rounded-lg"
                />
              </Form.Item>
              <Form.Item>
                <Link className="login-form-forgot text-sm text-indigo-600 hover:text-indigo-800 transition-colors duration-300" to="/forgot-password">
                  Forgot password?
                </Link>
              </Form.Item>

              <Form.Item>
                <Button type="primary" htmlType="submit" className="login-form-button w-full bg-gradient-to-r from-indigo-600 to-purple-600 text-white py-3 rounded-lg text-lg font-semibold hover:from-indigo-700 hover:to-purple-700 transition-all duration-300 shadow-md">
                  Sign In
                </Button>
              </Form.Item>

              <Divider plain className="text-gray-400">or continue with</Divider>
              <GoogleOAuthProvider clientId={CLIENT_ID}>
              <Form.Item>
                <LoginGoogle onLoginError={handleGoogleLoginError} />
              </Form.Item>
              </GoogleOAuthProvider>

              {loginError && (
                <p className="text-red-500 text-center mt-4">
                  {loginError}
                  {loginError.includes("ERR_BLOCKED_BY_CLIENT") && (
                    <span>
                      {" "}
                      This may be due to ad-blocking or privacy protection software. Please disable these and try again.
                    </span>
                  )}
                </p>
              )}

              <Form.Item>
                <div className="text-center">
                  <span className="text-gray-600">New to Edu Learn? </span>
                  <Link to="/register" className="text-indigo-600 hover:text-indigo-800 font-semibold transition-colors duration-300">
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
