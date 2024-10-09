import { Link } from 'react-router-dom';
import { Form, Input, Button, Typography, Divider } from 'antd';
import { UserOutlined, MailOutlined, LockOutlined, HomeOutlined } from '@ant-design/icons';
import image from '../../assets/register-bg.gif';

const { Title, Text } = Typography;

const RegisterPage = () => {
  const [form] = Form.useForm();

  const onFinish = (values: any) => {
    console.log('Received values of form: ', values);
  };

  const validateUsername = (_: any, value: string) => {
    if (!value || value.includes(' ') || value.length < 6) {
      return Promise.reject(new Error('Username must be at least 6 characters long and contain no spaces.'));
    }
    return Promise.resolve();
  };

  const validateEmail = (_: any, value: string) => {
    if (!value || !value.endsWith('@gmail.com')) {
      return Promise.reject(new Error('Email must end with @gmail.com.'));
    }
    return Promise.resolve();
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

  const validateConfirmPassword = (_: any, value: string) => {
    if (!value || value !== form.getFieldValue('password')) {
      return Promise.reject(new Error('The two passwords that you entered do not match!'));
    }
    return Promise.resolve();
  };
  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-r from-purple-900/20 to-indigo-900/20 backdrop-blur-md">
      <div className="flex w-full max-w-5xl bg-white shadow-2xl rounded-2xl overflow-hidden">
        <div className="w-1/2 bg-gradient-to-br from-indigo-900 to-purple-900 p-12 flex flex-col justify-center items-center">
          <Link to="/">
            <img src={image} alt="Study" className="w-3/5 mb-8 ml-20 rounded-full border-4 border-gold shadow-lg transform hover:scale-105 transition-transform duration-300" />
          </Link>
          <Title level={2} className="text-gold">Edu Learn</Title>
          <Text className="text-white text-center mt-4">Elevate Your Learning Experience</Text>
        </div>
        <div className="w-1/2 p-12 bg-gradient-to-br from-white to-gray-100">
          <Link to="/" className="text-indigo-600 hover:text-indigo-800 transition-colors duration-300 text-lg flex items-center mb-8">
            <HomeOutlined className="mr-2" />
            Back to Home
          </Link>
          <Title level={2} className="text-indigo-900 mb-8">Create an Account</Title>
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
                { required: true, message: 'Please input your username!' },
                { validator: validateUsername },
              ]}
            >
              <Input prefix={<UserOutlined className="site-form-item-icon text-indigo-600" />} placeholder="Username" className="py-2 px-4 rounded-lg" />
            </Form.Item>

            <Form.Item
              name="email"
              rules={[
                { required: true, message: 'Please input your E-mail!' },
                { validator: validateEmail },
              ]}
            >
              <Input prefix={<MailOutlined className="site-form-item-icon text-indigo-600" />} placeholder="Email" className="py-2 px-4 rounded-lg" />
            </Form.Item>

            <Form.Item
              name="password"
              rules={[
                { required: true, message: 'Please input your password!' },
                { validator: validatePassword },
              ]}
              hasFeedback
            >
              <Input.Password prefix={<LockOutlined className="site-form-item-icon text-indigo-600" />} placeholder="Password" className="py-2 px-4 rounded-lg" />
            </Form.Item>

            <Form.Item
              name="confirm"
              dependencies={['password']}
              hasFeedback
              rules={[
                { required: true, message: 'Please confirm your password!' },
                { validator: validateConfirmPassword },
              ]}
            >
              <Input.Password prefix={<LockOutlined className="site-form-item-icon text-indigo-600" />} placeholder="Confirm Password" className="py-2 px-4 rounded-lg" />
            </Form.Item>

            <Form.Item>
              <Button type="primary" htmlType="submit" className="w-full bg-gradient-to-r from-indigo-600 to-purple-600 text-white py-3 rounded-lg text-lg font-semibold hover:from-indigo-700 hover:to-purple-700 transition-all duration-300 shadow-md">
                Register
              </Button>
            </Form.Item>
          </Form>
          <Divider plain className="text-gray-400">Already have an account?</Divider>
          <div className="text-center">
            <Link to="/login" className="text-indigo-600 hover:text-indigo-800 font-semibold transition-colors duration-300">
              Sign in
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RegisterPage;
