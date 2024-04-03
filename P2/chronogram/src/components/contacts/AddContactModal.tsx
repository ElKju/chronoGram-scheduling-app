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

  const handleSubmit = () => {
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
        />
        <TextField
          label="Last Name"
          value={last_name}
          onChange={(e) => setLastName(e.target.value)}
          fullWidth
          margin="normal"
        />
        <TextField
          label="Email"
          value={email_address}
          onChange={(e) => setEmail(e.target.value)}
          fullWidth
          margin="normal"
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


