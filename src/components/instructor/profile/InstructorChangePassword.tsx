import { Form, Input, Button, Typography, message } from 'antd';
import { LockOutlined } from '@ant-design/icons';

const { Title } = Typography;

const InstructorChangePassword: React.FC = () => {
    const [form] = Form.useForm();

    const onFinish = (values: any) => {
        // TODO: Implement password change logic here
        console.log('Password change submitted', values);
        message.success('Password changed successfully');
        form.resetFields();
    };

    return (
        <div style={{ maxWidth: 400, marginLeft: '30px' }}>
            <Title level={2}>Change Password</Title>
            <Form
                form={form}
                name="changePassword"
                onFinish={onFinish}
                layout="vertical"
            >
                <Form.Item
                    name="currentPassword"
                    label="Current Password"
                    rules={[{ required: true, message: 'Please input your current password!' }]}
                >
                    <Input.Password prefix={<LockOutlined />} />
                </Form.Item>

                <Form.Item
                    name="newPassword"
                    label="New Password"
                    rules={[
                        { required: true, message: 'Please input your new password!' },
                        { min: 8, message: 'Password must be at least 8 characters long' },
                    ]}
                >
                    <Input.Password prefix={<LockOutlined />} />
                </Form.Item>

                <Form.Item
                    name="confirmNewPassword"
                    label="Confirm New Password"
                    dependencies={['newPassword']}
                    rules={[
                        { required: true, message: 'Please confirm your new password!' },
                        ({ getFieldValue }) => ({
                            validator(_, value) {
                                if (!value || getFieldValue('newPassword') === value) {
                                    return Promise.resolve();
                                }
                                return Promise.reject(new Error('The two passwords do not match!'));
                            },
                        }),
                    ]}
                >
                    <Input.Password prefix={<LockOutlined />} />
                </Form.Item>

                <Form.Item>
                    <Button type="primary" htmlType="submit" block>
                        Change Password
                    </Button>
                </Form.Item>
            </Form>
        </div>
    );
};

export default InstructorChangePassword;