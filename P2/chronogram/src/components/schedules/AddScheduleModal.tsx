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
import { ScheduleFormData, Availability_SetFormData, Invitees } from './scheduleInterfaces';
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
  const [availabilities, setAvailabilities] = useState<Availability_SetFormData[]>([]);
  const [selectedAvailabilities, setSelectedAvailabilities] = useState<Availability_SetFormData[]>([])

  const handleAddAvailability = () => {
    if (value && valueDuration) {
      const hour = valueDuration.hour();
      const minutes = valueDuration.minute();

      //End Date Computation:
      const addingEndDateHours = value.add(hour,'hours')
      const addingEndDateMinutes = addingEndDateHours.add(minutes,'minutes')
      console.log(value)

      const newAvailability: Availability_SetFormData = {
        start_time: value,
        end_time: addingEndDateMinutes,
      };
      setAvailabilities([...availabilities, newAvailability]);
      setSelectedAvailabilities([...selectedAvailabilities, newAvailability])
    }
  };

  const isOptionDisabled = (option: Availability_SetFormData) => {
    // Check if the option is already selected
    return selectedAvailabilities.some((availability) => availability.start_time === option.start_time);
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
              options = {availabilities}
              getOptionLabel={(option) => (option.start_time.subtract(4, 'hour')).toString()}
              value={selectedAvailabilities} // Use controlled value
              onChange={(event, newValue) => {
                setSelectedAvailabilities(newValue);
              }}
              getOptionDisabled={isOptionDisabled}
              renderInput={(params) => (
                <TextField
                  {...params}
                  variant="standard"
                  label="Selected Time Slots"
                  placeholder="Availabilities"
                />
              )}
            />

          <Autocomplete
              multiple
              id="tags-standard1"
              options = {contacts}
              getOptionLabel={(option) => option.first_name}
              defaultValue={[]}
              renderInput={(params) => (
                <TextField
                  {...params}
                  variant="standard"
                  label="Invite Contacts"
                  placeholder="Invite Contacts"
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
