import React, { useState } from 'react';
import {Link, useNavigate } from 'react-router-dom';
import axios from 'axios';

const RegisterPage: React.FC = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [email, setEmail] = useState('');
  const navigate = useNavigate();

  const handleRegister = async () => {
    try {
      const response = await axios.post('http://127.0.0.1:8000/register/', {
        username,
        password,
        email,
      });
      console.log('Registration successful:', response.data);
      // Handle successful registration (e.g., navigate to login page)
      navigate('/'); // Redirect to the login page
    } catch (error) {
      console.error('Registration error:', error);
      // Handle registration error (e.g., display error message)
    }
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', marginTop: '50px' }}>
      <h2 style={{ fontSize: '1.8rem', marginBottom: '20px' }}>Register</h2>
      <input
        type="text"
        placeholder="Username"
        value={username}
        onChange={(e) => setUsername(e.target.value)}
        style={{ width: '300px', marginBottom: '20px', padding: '12px', fontSize: '1.3rem' }}
      />
      <input
        type="password"
        placeholder="Password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        style={{ width: '300px', marginBottom: '20px', padding: '12px', fontSize: '1.3rem' }}
      />
      <input
        type="email"
        placeholder="Email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        style={{ width: '300px', marginBottom: '20px', padding: '12px', fontSize: '1.3rem' }}
      />
      <button onClick={handleRegister} style={{ width: '320px', padding: '12px', backgroundColor: 'blue', color: 'white', border: 'none', fontSize: '1.3rem', cursor: 'pointer' }}>Register</button>
      <p style={{ marginTop: '20px', fontSize: '1.3rem', padding: '20px' }} >
        Already have an account? <Link to="/" style={{ textDecoration: 'underline', color: 'blue' }}>Login</Link>
      </p>
    </div>
  );
};

export default RegisterPage;
