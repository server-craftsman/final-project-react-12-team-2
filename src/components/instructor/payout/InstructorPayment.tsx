
import { Form, Input, DatePicker, Button, Upload, Typography, Space } from 'antd'
import { UploadOutlined } from '@ant-design/icons'

const { TextArea } = Input
const { Title } = Typography

const InstructorPayment = () => {
    const [form] = Form.useForm()

    const onFinish = (values: any) => {
        console.log('Form values:', values)
        // Add logic to handle form submission
    }

    return (
        <div className="instructor-profile">
            <Title level={2}>Instructor Profile</Title>

          
        </div>
    )
}

export default InstructorPayment