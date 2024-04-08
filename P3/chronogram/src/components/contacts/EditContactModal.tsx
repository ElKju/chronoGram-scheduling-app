import React, { useState, useEffect } from 'react';
import { Dialog, DialogTitle, DialogContent, DialogActions, Button, TextField, Typography } from '@mui/material';
import { Contact, ContactFormData } from './contactInterfaces';

interface EditContactModalProps {
  open: boolean;
  onClose: () => void;
  onSubmit: (formData: ContactFormData, contactId: number) => void;
  contact: Contact;
}

const EditContactModal: React.FC<EditContactModalProps> = ({ open, onClose, onSubmit, contact }) => {
  const [first_name, setFirstName] = useState(contact.first_name);
  const [last_name, setLastName] = useState(contact.last_name);
  const [email_address, setEmail] = useState(contact.email_address);

  // State variables for validation errors
  const [firstNameError, setFirstNameError] = useState('');
  const [lastNameError, setLastNameError] = useState('');
  const [emailError, setEmailError] = useState('');

  useEffect(() => {
    if (contact != null) {
      setFirstName(contact.first_name);
      setLastName(contact.last_name);
      setEmail(contact.email_address);
    }
  }, [contact]);

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

    // Submit the form
    onSubmit({ first_name, last_name, email_address }, contact.id);
  };

  return (
    <Dialog open={open} onClose={onClose}>
      <DialogTitle>Edit Contact</DialogTitle>
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
        <Button onClick={onClose}>Cancel</Button>
        <Button onClick={handleSubmit} color="primary">Save</Button>
      </DialogActions>
    </Dialog>
  );
};

export default EditContactModal;
