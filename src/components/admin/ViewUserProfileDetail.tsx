import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { Row, Col, Form, Input } from 'antd';
import { User, UserRole } from '../../models/User';
import usersData from '../../data/users.json';
import EditUserProfile from './EditUserProfile';
import ChangePasswordAdmin from './ChangePasswordAdmin';

const ViewUserProfileDetail = () => {
  const { id } = useParams<{ id: string }>();
  const [user, setUser] = useState<User | null>(null);
  const [isChangePasswordVisible, setChangePasswordVisible] = useState(false);

  useEffect(() => {
    const userData = usersData.users.find(user => user.id === id);
    if (userData) {
      setUser({
        ...userData,
        role: userData.role as UserRole,
        dob: new Date(userData.dob)
      });
    } else {
      setUser(null);
    }
  }, [id]);

  if (!user) {
    return <div>User not found</div>;
  }

  return (
    <div className="max-w-2xl mx-auto p-5">
      <Row gutter={16} align="middle">
        <Col span={6} className="text-center pl-40">
          <img
            src={user.avatar_url || ''}
            alt={`${user.name}'s avatar`}
            className="w-36 h-36 rounded-full mx-auto"
          />
          <h2 className="mt-2 text-lg font-semibold">{user.name}</h2>
          <div className="mt-4 flex justify-center">
            <EditUserProfile />
            <button className="bg-red-500 text-white px-4 py-2 rounded">Delete</button>
            {user.role === UserRole.ADMIN && (
              <button
                className="bg-gradient-tone text-white px-4 py-2 mt-2 rounded"
                onClick={() => setChangePasswordVisible(true)}
              >
                Change Password
              </button>
            )}
          </div>
        </Col>
        <Col span={18}>
          <Form layout="vertical">
            <Row gutter={16}>
              <Col span={12}>
                <Form.Item label="Name">
                  <Input value={user.name.split(' ')[0]} readOnly />
                </Form.Item>
              </Col>
              <Col span={12}>
                <Form.Item label="Role">
                  <Input value={user.role} readOnly />
                </Form.Item>
              </Col>
            </Row>
            <Row gutter={16}>
              <Col span={12}>
                <Form.Item label="Email Address">
                  <Input value={user.email} readOnly />
                </Form.Item>
              </Col>
              <Col span={12}>
                <Form.Item label="Phone Number">
                  <Input value={user.phone_number} readOnly />
                </Form.Item>
              </Col>
            </Row>
            <Row gutter={16}>
              <Col span={12}>
                <Form.Item label="Status">
                  <Input value={user.status ? 'Active' : 'Inactive'} readOnly />
                </Form.Item>
              </Col>
              <Col span={12}>
                <Form.Item label="Description">
                  <Input value={user.description} readOnly />
                </Form.Item>
              </Col>
              <Col span={12}>
                <Form.Item label="Date of Birth">
                  <Input value={user.dob.toDateString()} readOnly />
                </Form.Item>
              </Col>
              <Col span={12}>
                <Form.Item label="Balance">
                  <Input value={user.balance} readOnly />
                </Form.Item>
              </Col>
            </Row>
          </Form>
        </Col>
      </Row>
      <ChangePasswordAdmin
        visible={isChangePasswordVisible}
        onClose={() => setChangePasswordVisible(false)}
        currentPassword={user.password} // Assuming user object has a password field
      />
    </div>
  );
};

export default ViewUserProfileDetail;
