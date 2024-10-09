import { Form, Input, DatePicker, Button, Upload, Typography, Space, Tabs } from 'antd'
import { UploadOutlined } from '@ant-design/icons'
import { TINYMCE_API_KEY } from '../../services/config/apiClientofTiny'
import { Editor } from '@tinymce/tinymce-react'


const { Title } = Typography
const { TabPane } = Tabs

const Setting = () => {
    const [form] = Form.useForm()
    const [passwordForm] = Form.useForm()

    const onFinish = (values: any) => {
        console.log('Form values:', values)
        // Add logic to handle form submission
    }

    const onPasswordChange = (values: any) => {
        console.log('Password change values:', values)
        // Add logic to handle password change
    }

    return (
        <div className="instructor-profile">
            <Title level={2}>Settings</Title>

            <Tabs defaultActiveKey="1">
                <TabPane tab="Profile Information" key="1">
                    <Space direction="vertical" size="large" style={{ display: 'flex' }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                            {/* Image upload */}
                            <Upload
                                listType="picture-card"
                                maxCount={1}
                                beforeUpload={() => false} // Prevent auto upload
                            >
                                <div>
                                    <UploadOutlined />
                                    <div style={{ marginTop: 8 }}>Upload Photo</div>
                                </div>
                            </Upload>

                            {/* Video upload */}
                            <Upload
                                listType="picture-card"
                                maxCount={1}
                                beforeUpload={() => false} // Prevent auto upload
                            >
                                <div>
                                    <UploadOutlined />
                                    <div style={{ marginTop: 8 }}>Upload Video</div>
                                </div>
                            </Upload>
                        </div>
                        {/* Profile Form */}
                        <Form
                            form={form}
                            layout="vertical"
                            onFinish={onFinish}
                            autoComplete="off"
                        >
                            <Form.Item
                                name="fullName"
                                label="Full Name"
                                rules={[{ required: true, message: 'Please input your full name!' }]}
                            >
                                <Input />
                            </Form.Item>

                            <Form.Item
                                name="phoneNumber"
                                label="Phone Number"
                                rules={[{ required: true, message: 'Please input your phone number!' }]}
                            >
                                <Input />
                            </Form.Item>

                            <Form.Item
                                name="dateOfBirth"
                                label="Date of Birth"
                                rules={[{ required: true, message: 'Please select your date of birth!' }]}
                            >
                                <DatePicker style={{ width: '100%' }} />
                            </Form.Item>

                            <Form.Item
                                name="description"
                                label="Description"
                                rules={[{ required: true, message: 'Please input your description!' }]}
                            >
                                <Editor
                                    apiKey={TINYMCE_API_KEY}
                                    initialValue=""
                                    init={{
                                        height: 300,
                                        menubar: false,
                                        plugins: [
                                            'advlist autolink lists link image charmap print preview anchor',
                                            'searchreplace visualblocks code fullscreen',
                                            'insertdatetime media table paste code help wordcount'
                                        ],
                                        toolbar:
                                            'undo redo | styleselect | bold italic | alignleft aligncenter alignright alignjustify | bullist numlist outdent indent | link image | code',
                                    }}
                                //   onEditorChange={(content, editor) => {
                                //     // Handle the content change
                                //   }}
                                />
                            </Form.Item>

                            <Form.Item>
                                <Button
                                    type="primary"
                                    htmlType="submit"
                                    className="bg-blue-500 hover:bg-blue-600 border-blue-500 hover:border-blue-600 text-white"
                                >
                                    Save Profile
                                </Button>
                            </Form.Item>
                        </Form>
                    </Space>
                </TabPane>
                <TabPane tab="Change Password" key="2">
                    <Form
                        form={passwordForm}
                        layout="vertical"
                        onFinish={onPasswordChange}
                        autoComplete="off"
                    >
                        <Form.Item
                            name="currentPassword"
                            label="Current Password"
                            rules={[{ required: true, message: 'Please input your current password!' }]}
                        >
                            <Input.Password />
                        </Form.Item>

                        <Form.Item
                            name="newPassword"
                            label="New Password"
                            rules={[{ required: true, message: 'Please input your new password!' }]}
                        >
                            <Input.Password />
                        </Form.Item>

                        <Form.Item
                            name="confirmPassword"
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
                </TabPane>
            </Tabs>
        </div>
    )
}

export default Setting;