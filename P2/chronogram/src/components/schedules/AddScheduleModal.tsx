import React, { useState } from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  TextField,
  Autocomplete
} from '@mui/material';
import { DateTimePicker } from '@mui/x-date-pickers/DateTimePicker';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { ScheduleFormData, Availability_Set, Invitees } from './scheduleInterfaces';
import { SelectChangeEvent } from '@mui/material';
import dayjs, { Dayjs } from 'dayjs';
import { Contact } from '../contacts/contactInterfaces';
import { TimeField } from '@mui/x-date-pickers';

interface AddScheduleModalProps {
  open: boolean;
  onClose: () => void;
  onSubmit: (formData: ScheduleFormData) => void;
  contacts: Contact[];
}

const AddScheduleModal: React.FC<AddScheduleModalProps> = ({ open, onClose, onSubmit, contacts }) => {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [value, setValue] = React.useState<Dayjs | null>(dayjs('2024-04-01T15:30'));
  const [valueDuration, setDuration] = React.useState<Dayjs | null>(dayjs('2024-04-01T15:30'));

  const handleAddAvailability = () => {
    if (value && valueDuration) {
      const hour = valueDuration.hour();
      const minutes = valueDuration.minute();
      const newAvailability: Availability_Set = {
        id: Date.now(), // Generate unique ID for the new availability
        start_time: value,
        end_time: value,
      };
     console.log("testing")
    }
  };

  const handleInviteeChange = (event: SelectChangeEvent<number>) => {
    console.log("ldfklkdfldkflkdf")
    //const selectedInviteeId = e.target.value as number;
    //const selectedInvitee: Invitees = { id: selectedInviteeId, calendar: null, contact: null }; // You need to fetch calendar and contact based on the selected ID
    //setFormData({ ...formData, invitees: [...formData.invitees, selectedInvitee] });
  };

  const handleSubmit = () => {
    console.log(value)
    //onSubmit(formData);
    onClose();
  };

  const onCloseTest = () => {
    console.log(valueDuration)
  }

  return (
    <LocalizationProvider dateAdapter={AdapterDayjs}>
      <Dialog open={open} onClose={onClose}>
        <DialogTitle>Add Schedule</DialogTitle>
        <DialogContent>
          <TextField
            label="Title"
            name="title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            fullWidth
            margin="normal"
          />
          <TextField
            label="Description"
            name="description"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            fullWidth
            margin="normal"
          />
          <br/>
          <br/>
          <TimeField
            label="Duration"
            defaultValue={dayjs('2022-04-17T15:30')}
            value={valueDuration}
            format="HH:mm"
            onChange = {(newValue) => setDuration(newValue)}
          />
          <br/>
          <br/>
          <DateTimePicker
            label="Available Time"
            defaultValue={null}
            value={value}
            onChange={(newValue) => setValue(newValue)}
          />
          <Button onClick={handleAddAvailability}>Add Availability</Button>
          <Autocomplete
              multiple
              id="tags-standard"
              options = {contacts}
              getOptionLabel={(option) => option.first_name}
              defaultValue={[]}
              renderInput={(params) => (
                <TextField
                  {...params}
                  variant="standard"
                  label="Multiple values"
                  placeholder="Favorites"
                />
              )}
            />
        
        </DialogContent>
        <DialogActions>
          <Button onClick={onClose}>Cancel</Button>
          <Button onClick={handleSubmit} color="primary">Add Schedule</Button>
        </DialogActions>
      </Dialog>
    </LocalizationProvider>
  );
};

export default AddScheduleModal;
