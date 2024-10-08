
import { Form, Input, DatePicker, Button, Upload, Typography, Space } from 'antd'
import { UploadOutlined } from '@ant-design/icons'

const { TextArea } = Input
const { Title } = Typography

const InstructorProfile = () => {
    const [form] = Form.useForm()

    const onFinish = (values: any) => {
        console.log('Form values:', values)
        // Add logic to handle form submission
    }

    return (
        <div className="instructor-profile">
            <Title level={2}>Instructor Profile</Title>

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
                        <TextArea rows={4} />
                    </Form.Item>

                    <Form.Item>
                        <Button type="primary" htmlType="submit">
                            Save Profile
                        </Button>
                    </Form.Item>

                </Form>
            </Space>
        </div>
    )
}

export default InstructorProfile