import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';

const LoginPage: React.FC = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate();

  const handleLogin = async () => {
    try {
      const response = await axios.post('http://127.0.0.1:8000/login/', {
        username,
        password,
      });
      console.log('Login successful:', response.data);
      
      // Extract the access token from the response data
      const accessToken = response.data.access;
      
      // Store the access token in localStorage
      localStorage.setItem('accessToken', accessToken);
      
      // Redirect to the main page
      navigate('/main');
    } catch (error) {
      console.error('Login error:', error);
      // Handle login error (e.g., display error message)
    }
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', marginTop: '50px', paddingBottom: '83px'}}>
      <h2 style={{ fontSize: '1.8rem', marginBottom: '20px' }}>Login</h2>
      <input
        type="text"
        placeholder="Username"
        value={username}
        onChange={(e) => setUsername(e.target.value)}
        style={{ width: '300px', marginBottom: '20px', padding: '12px', fontSize: '1.3rem' }}
      />
      <br />
      <input
        type="password"
        placeholder="Password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        style={{ width: '300px', marginBottom: '20px', padding: '12px', fontSize: '1.3rem' }}
      />
      <br />
      <button onClick={handleLogin} style={{ width: '320px', padding: '12px', backgroundColor: 'blue', color: 'white', border: 'none', fontSize: '1.3rem', cursor: 'pointer' }}>Login</button>
      <p style={{ marginTop: '20px', fontSize: '1.3rem', padding: '20px' }} >
        Don't have an account? <Link to="/register" style={{ textDecoration: 'underline', color: 'blue' }}>Sign up</Link>
      </p>
    </div>
  );
};

export default LoginPage;
