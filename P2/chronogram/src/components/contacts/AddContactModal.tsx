import React, { useState } from 'react';
import { Dialog, DialogTitle, DialogContent, DialogActions, Button, TextField } from '@mui/material';
import { ContactFormData } from './contactInterfaces';

interface AddContactModalProps {
  open: boolean;
  onClose: () => void;
  onSubmit: (formData: ContactFormData) => void;
}

const AddContactModal: React.FC<AddContactModalProps> = ({ open, onClose, onSubmit }) => {
  const [first_name, setFirstName] = useState('');
  const [last_name, setLastName] = useState('');
  const [email_address, setEmail] = useState('');

  // State variables for validation errors
  const [firstNameError, setFirstNameError] = useState('');
  const [lastNameError, setLastNameError] = useState('');
  const [emailError, setEmailError] = useState('');

  const handleSubmit = () => {
    // Clear previous validation errors
    setFirstNameError('');
    setLastNameError('');
    setEmailError('');

    // Check for validation errors
    let isValid = true;
    if (!first_name) {
      setFirstNameError('First name is required');
      isValid = false;
    }
    if (!last_name) {
      setLastNameError('Last name is required');
      isValid = false;
    }
    if (!email_address) {
      setEmailError('Email is required');
      isValid = false;
    }

    const isValidEmail = (email: string): boolean => {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return emailRegex.test(email);
      };

    if (!isValidEmail(email_address)){
        setEmailError('Invalid email format');
        isValid = false;
    }
    
    // If validation fails, prevent form submission
    if (!isValid) {
      return;
    }

    onSubmit({ first_name, last_name, email_address });
    setFirstName('');
    setLastName('');
    setEmail('');
  };

  return (
    <Dialog open={open} onClose={onClose}>
      <DialogTitle>Add Contact</DialogTitle>
      <DialogContent>
        <TextField
          label="First Name"
          value={first_name}
          onChange={(e) => setFirstName(e.target.value)}
          fullWidth
          margin="normal"
          error={!!firstNameError}
          helperText={firstNameError}
        />
        <TextField
          label="Last Name"
          value={last_name}
          onChange={(e) => setLastName(e.target.value)}
          fullWidth
          margin="normal"
          error={!!lastNameError}
          helperText={lastNameError}
        />
        <TextField
          label="Email"
          value={email_address}
          onChange={(e) => setEmail(e.target.value)}
          fullWidth
          margin="normal"
          error={!!emailError}
          helperText={emailError}
        />
      </DialogContent>
      <DialogActions>
        <Button style={{ textTransform: 'none', fontSize: '1rem', padding: '5px 10px' }} onClick={onClose}>Cancel</Button>
        <Button style={{ textTransform: 'none', fontSize: '1rem', padding: '5px 10px' }} onClick={handleSubmit} color="primary">Add Contact</Button>
      </DialogActions>
    </Dialog>
  );
};

export default AddContactModal;


