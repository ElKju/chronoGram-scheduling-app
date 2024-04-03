import React from 'react';
import { AppBar, Toolbar, Typography, Button } from '@mui/material';
import logo from './logo_idea1.png';
import { Link, useNavigate } from 'react-router-dom'; // Import useNavigate hook
import axios from 'axios';

const Header: React.FC = () => {
  const navigate = useNavigate(); // Initialize useNavigate hook

  const handleSignOut = async () => {
    try {
      const token = localStorage.getItem('accessToken'); // Retrieve the authentication token from local storage
      console.log(token);
      await axios.post('http://127.0.0.1:8000/logout/', {}, {
        headers: {
          Authorization: `Bearer ${token}`, // Include the authentication token in the request headers
        }
      });
      console.log('Sign out successful');
      // Handle successful sign out (e.g., clear tokens and navigate to login page)
      navigate('/'); // Navigate to the login page after successful logout
    } catch (error) {
      console.error('Sign out error:', error);
      // Handle sign out error (e.g., display error message)
    }
  };

  return (
    <AppBar position="static" sx={{ backgroundColor: 'white' }}>
      <Toolbar>
        <Link to="/">
          <img src={logo} alt="logo" style={{ marginLeft: '-20px', marginRight: '5px', height: '66px' }} />
        </Link>
        <Typography variant="h6" sx={{ fontWeight: 'bold', color: 'black', fontSize: '2rem' }}>
          ChronoGram
        </Typography>
        <div style={{ flexGrow: 1 }}></div>
        <Button variant="outlined" sx={{ textTransform: 'none', fontSize: '1rem' }} onClick={handleSignOut}>
          Sign Out
        </Button>
      </Toolbar>
    </AppBar>
  );
};

export default Header;
