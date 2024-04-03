import React, { useState } from 'react';
import axios from 'axios';

const AccountEditPage: React.FC = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [email, setEmail] = useState('');
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');

  const handleEditAccount = async () => {
    try {
      const token = localStorage.getItem('accessToken');
      const response = await axios.put(
        'http://127.0.0.1:8000/account/edit/',
        { username, password, email, first_name: firstName, last_name: lastName },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      console.log('Account edit successful:', response.data);
      // Handle successful account edit (e.g., display success message)
    } catch (error) {
      console.error('Account edit error:', error);
      // Handle account edit error (e.g., display error message)
    }
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', padding: '20px' }}>
      <h2 style={{ fontSize: '1.8rem', marginBottom: '20px' }}>Edit Account</h2>
      <input
        type="text"
        placeholder="New Username"
        value={username}
        onChange={(e) => setUsername(e.target.value)}
        style={{ width: '350px', marginBottom: '20px', padding: '12px', fontSize: '1.3rem' }}
      />
      <input
        type="password"
        placeholder="New Password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        style={{ width: '350px', marginBottom: '20px', padding: '12px', fontSize: '1.3rem' }}
      />
      <input
        type="email"
        placeholder="New Email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        style={{ width: '350px', marginBottom: '20px', padding: '12px', fontSize: '1.3rem' }}
      />
      <input
        type="text"
        placeholder="First Name"
        value={firstName}
        onChange={(e) => setFirstName(e.target.value)}
        style={{ width: '350px', marginBottom: '20px', padding: '12px', fontSize: '1.3rem' }}
      />
      <input
        type="text"
        placeholder="Last Name"
        value={lastName}
        onChange={(e) => setLastName(e.target.value)}
        style={{ width: '350px', marginBottom: '20px', padding: '12px', fontSize: '1.3rem' }}
      />
      <div style={{ padding: '20px' }}>
        <button onClick={handleEditAccount} style={{ width: '370px', padding: '12px', backgroundColor: 'blue', color: 'white', border: 'none', fontSize: '1.3rem', cursor: 'pointer' }}>Save Changes</button>
      </div>
    </div>
  );
};

export default AccountEditPage;
