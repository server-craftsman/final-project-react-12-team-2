import { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { Form, Input, Button, Modal } from 'antd';
import { User } from '../../models/User';
import usersData from '../../data/users.json';

const EditUserProfile = () => {
  const { id } = useParams<{ id: string }>();
  const [user, setUser] = useState<User | null>(null);
  const [isModalVisible, setIsModalVisible] = useState(false);

  useEffect(() => {
    const userData = usersData.users.find(user => user.id === id);
    setUser(userData || null);
  }, [id]);

  const showModal = () => {
    setIsModalVisible(true);
  };

  const handleOk = () => {
    setIsModalVisible(false);
  };

  const handleCancel = () => {
    setIsModalVisible(false);
  };

  const handleFormSubmit = (values: any) => {
    console.log('Updated User Information:', values);
    handleOk();
  };

  if (!user) {
    return <div>User not found</div>;
  }

  return (
    <div className="max-w-2xl mx-auto p-5">
      <Button type="primary" onClick={showModal} className='mr-2 bg-blue-500 text-white px-4 py-2 rounded'>
        Edit
      </Button>
      <Modal
        title="Edit User Profile"
        open={isModalVisible}
        onOk={handleOk}
        onCancel={handleCancel}
        footer={null}
      >
        <Form
          layout="vertical"
          initialValues={{
            name: user.name,
            email: user.email,
            phone_number: user.phone_number,
            role: user.role,
            status: user.status ? 'Active' : 'Inactive',
            description: user.description,
            dob: user.dob,
            balance: user.balance,
          }}
          onFinish={handleFormSubmit}
        >
          <Form.Item label="Name" name="name">
            <Input />
          </Form.Item>
          <Form.Item label="Email Address" name="email">
            <Input />
          </Form.Item>
          <Form.Item label="Phone Number" name="phone_number">
            <Input />
          </Form.Item>
          <Form.Item label="Role" name="role">
            <Input />
          </Form.Item>
          <Form.Item label="Status" name="status">
            <Input />
          </Form.Item>
          <Form.Item label="Description" name="description">
            <Input />
          </Form.Item>
          <Form.Item label="Date of Birth" name="dob">
            <Input />
          </Form.Item>
          <Form.Item label="Balance" name="balance">
            <Input />
          </Form.Item>
          <Form.Item>
            <Button type="primary" htmlType="submit">
              Update
            </Button>
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
};

export default EditUserProfile;
