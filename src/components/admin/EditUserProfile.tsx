import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Form, Input, Button, message, DatePicker } from 'antd';
import { User } from '../../models/User';
import usersData from '../../data/users.json';
import { Rule } from 'antd/es/form';
import moment from 'moment';

const EditUserProfile = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [user, setUser] = useState<User | null>(null);
  const [form] = Form.useForm();

  useEffect(() => {
    const userData = usersData.users.find(user => user.id === id);
    if (userData) {
      const userWithDateDob = {
        ...userData,
        dob: userData.dob ? moment(userData.dob) : null
      };
      setUser(userWithDateDob as unknown as User);
      form.setFieldsValue({
        name: userData.name,
        email: userData.email,
        phone_number: userData.phone_number,
        role: userData.role,
        status: userData.status ? 'Active' : 'Inactive',
        description: userData.description,
        dob: userData.dob ? moment(userData.dob) : null,
      });
    }
  }, [id, form]);

  const handleFormSubmit = (values: any) => {
    console.log('Updated User Information:', values);
    message.success('Profile updated successfully');
    navigate('/admin/admin-info');
  };

  if (!user) {
    return <div>User not found</div>;
  }

  const validationRules = {
    name: [{ required: true, message: 'Please enter the name' }],
    email: [
      { required: true, message: 'Please enter the email address' },
      { type: 'email', message: 'Please enter a valid email address. Please include a @ symbol.' },
    ],
    phone_number: [
      { required: true, message: 'Please enter the phone number.' }, 
      { pattern: /^[0-9]+$/, message: 'Please enter a valid phone number. Only numbers are allowed.' }
    ],
    description: [{ required: true, message: 'Please enter the description' }],
    dob: [
      { required: true, message: 'Please enter the date of birth' },
      {
        validator: (_: any, value: moment.Moment | null) => {
          if (!value || (value.isBefore(moment()) && value.isAfter(moment().subtract(100, 'years')))) {
            return Promise.resolve();
          }
          return Promise.reject(new Error('Please enter a valid date of birth within the last 100 years.'));
        }
      }
    ],
  };

  return (
    <div className="max-w-2xl mx-auto p-5">
      <h1 className="text-2xl font-bold mb-4">Edit User Profile</h1>
      <Form
        form={form}
        layout="vertical"
        onFinish={handleFormSubmit}
      >
        <Form.Item label="Name" name="name" rules={validationRules.name as Rule[]}>
          <Input />
        </Form.Item>
        <Form.Item label="Email Address" name="email" rules={validationRules.email as Rule[]}>
          <Input />
        </Form.Item>
        <Form.Item label="Phone Number" name="phone_number" rules={validationRules.phone_number as Rule[]}>
          <Input />
        </Form.Item>
        <Form.Item label="Description" name="description" rules={validationRules.description as Rule[]}>
          <Input.TextArea />
        </Form.Item>
        <Form.Item label="Date of Birth" name="dob" rules={validationRules.dob as Rule[]}>
          <DatePicker format="YYYY-MM-DD" />
        </Form.Item>
        <Form.Item>
          <Button type="primary" htmlType="submit">
            Update
          </Button>
          <Button onClick={() => navigate('/admin/admin-info')} className="ml-2">
            Cancel
          </Button>
        </Form.Item>
      </Form>
    </div>
  );
};

export default EditUserProfile;
