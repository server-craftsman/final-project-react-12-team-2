import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { User } from '../../models/User';
import usersData from '../../data/users.json';

const ViewUserProfileDetail = () => {
  const { id } = useParams<{ id: string }>();
  const [user, setUser] = useState<User | null>(null);

  useEffect(() => {
    const userData = usersData.users.find(user => user.id === id);
    setUser(userData || null);
  }, [id]);

  if (!user) {
    return <div>User not found</div>;
  }

  return (
    <div>
      <h1>{user.name}</h1>
      <p>Email: {user.email}</p>
      <p>Role: {user.role}</p>
      <p>Status: {user.status ? 'Active' : 'Inactive'}</p>
      <p>Description: {user.description}</p>
      <p>Phone Number: {user.phone_number}</p>
      <p>Date of Birth: {user.dob}</p>
      <p>Balance: ${user.balance}</p>
      <img src={user.avatar_url || ''} alt={`${user.name}'s avatar`} />
      {/* Add more fields as needed */}
    </div>
  );
};

export default ViewUserProfileDetail;
