import { Form, Input, DatePicker, Button, Upload, Typography, message } from 'antd'
import { UploadOutlined } from '@ant-design/icons'
import { TINYMCE_API_KEY } from '../../services/config/apiClientofTiny'
import { Editor } from '@tinymce/tinymce-react'
import moment from 'moment'

const { Title } = Typography

const InstructorInfo = () => {
    const [form] = Form.useForm()

    const onFinish = (values: any) => {
        console.log('Form values:', values)
        message.success('Profile updated successfully!')
        // Add logic to handle form submission
    }

    const validateFullName = (_: any, value: string) => {
        if (!value || value.trim() === '') {
            return Promise.reject(new Error('Please input your full name!'))
        }
        return Promise.resolve()
    }

    const validatePhoneNumber = (_: any, value: string) => {
        const phoneRegex = /^[+]?[(]?[0-9]{3}[)]?[-\s.]?[0-9]{3}[-\s.]?[0-9]{4,6}$/
        if (!value || !phoneRegex.test(value)) {
            return Promise.reject(new Error('Please input a valid phone number!'))
        }
        return Promise.resolve()
    }

    const validateDateOfBirth = (_: any, value: any) => {
        if (!value) {
            return Promise.reject(new Error('Please select your date of birth!'))
        }
        const currentDate = moment()
        const hundredYearsAgo = moment().subtract(100, 'years')
        if (value.isAfter(currentDate) || value.isBefore(hundredYearsAgo)) {
            return Promise.reject(new Error('Date of birth is not valid. It should be within the last 100 years.'))
        }
        return Promise.resolve()
    }

    // const validateDescription = (_: any, value: string) => {
    //     if (!value || value.trim() === '') {
    //         return Promise.reject(new Error('Please input your description!'))
    //     }
    //     return Promise.resolve()
    // }

    return (
        <div className="instructor-profile">
            <Title level={2}>Settings</Title>
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
                    rules={[{ validator: validateFullName }]}
                >
                    <Input />
                </Form.Item>

                <Form.Item
                    name="phoneNumber"
                    label="Phone Number"
                    rules={[{ validator: validatePhoneNumber }]}
                >
                    <Input />
                </Form.Item>

                <Form.Item
                    name="dateOfBirth"
                    label="Date of Birth"
                    rules={[{ validator: validateDateOfBirth }]}
                >
                    <DatePicker style={{ width: '100%' }} />
                </Form.Item>

                <Form.Item
                    name="description"
                    label="Description"
                // rules={[{ validator: validateDescription }]}
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
        </div>
    )
}

export default InstructorInfo;