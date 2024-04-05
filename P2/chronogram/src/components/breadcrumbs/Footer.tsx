import React from 'react';
import { AppBar, Toolbar, Typography } from '@mui/material';

const Footer: React.FC = () => {
  return (
    <AppBar position="static" sx={{ backgroundColor: 'white', top: 'auto', bottom: 0 }}>
      <Toolbar style={{ justifyContent: 'center' }}>
        {/* Contact Us */}
        <Typography variant="body1" sx={{ color: 'black' }}>
          Need help? <a href="contact-us">Contact us</a>.
        </Typography>
      </Toolbar>
    </AppBar>
  );
};

export default Footer;


