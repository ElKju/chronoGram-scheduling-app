import React from 'react';
import { AppBar, Toolbar, Typography, Button } from '@mui/material';
import logo from './logo_idea1.png';
import { Link } from 'react-router-dom';

const Header: React.FC = () => {
  return (
    <AppBar position="static" sx={{ backgroundColor: 'white' }}>
      <Toolbar>
      <Link to="/"> 
          <img src={logo} alt="logo" style={{ marginLeft:'-20px', marginRight: '5px', height: '66px' }} />
        </Link>
        <Typography variant="h6" sx={{ fontWeight: 'bold', color: 'black', fontSize: '2rem' }}>
          ChronoGram
        </Typography>
        <div style={{ flexGrow: 1 }}></div>
        <Button variant="outlined" sx={{ textTransform: 'none', fontSize: '1rem' }} onClick={() => console.log('Sign out clicked')}>
          Sign Out
        </Button>
      </Toolbar>
    </AppBar>
  );
};

export default Header;



