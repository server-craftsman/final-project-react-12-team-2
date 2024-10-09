import { Form, Input, Button, Typography } from 'antd';
const { Title } = Typography;

const ChangePasswordInstructor: React.FC = () => {
    const [passwordForm] = Form.useForm();

    const onFinish = (values: any) => {
        // TODO: Implement password change logic here
        console.log('Password change submitted', values);
    };

    const validatePassword = (_: any, value: string) => {
        if (!value) {
            return Promise.reject(new Error('Please input your password!'));
        }
        if (value.length < 8) {
            return Promise.reject(new Error('Password must be at least 8 characters long!'));
        }
        if (!/[A-Z]/.test(value)) {
            return Promise.reject(new Error('Password must contain at least one uppercase letter!'));
        }
        if (!/\d/.test(value)) {
            return Promise.reject(new Error('Password must contain at least one number!'));
        }
        if (!/[!@#$%^&*(),.?":{}|<>]/.test(value)) {
            return Promise.reject(new Error('Password must contain at least one special character!'));
        }
        return Promise.resolve();
    };

    const validateConfirmPassword = ({ getFieldValue }: any) => ({
        validator(_: any, value: string) {
            if (!value || getFieldValue('newPassword') === value) {
                return Promise.resolve();
            }
            return Promise.reject(new Error('The two passwords do not match!'));
        },
    });

    return (
        <div style={{ maxWidth: 400, marginLeft: '30px' }}>
            <Title level={2}>Change Password</Title>
            <Form
                form={passwordForm}
                layout="vertical"
                onFinish={onFinish}
                autoComplete="off"
            >
                <Form.Item
                    name="currentPassword"
                    label="Current Password"
                    rules={[
                        { required: true, message: 'Please input your current password!' },
                        { validator: validatePassword },
                    ]}
                >
                    <Input.Password />
                </Form.Item>

                <Form.Item
                    name="newPassword"
                    label="New Password"
                    rules={[
                        { required: true, message: 'Please input your new password!' },
                        { validator: validatePassword },
                    ]}
                >
                    <Input.Password />
                </Form.Item>

                <Form.Item
                    name="confirmPassword"
                    label="Confirm New Password"
                    dependencies={['newPassword']}
                    rules={[
                        { required: true, message: 'Please confirm your new password!' },
                        validateConfirmPassword,
                    ]}
                >
                    <Input.Password />
                </Form.Item>

                <Form.Item>
                    <Button
                        type="primary"
                        htmlType="submit"
                        className="bg-blue-500 hover:bg-blue-600 border-blue-500 hover:border-blue-600 text-white"
                    >
                        Change Password
                    </Button>
                </Form.Item>
            </Form>
        </div>
    );
};

export default ChangePasswordInstructor;