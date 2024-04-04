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
import { ScheduleFormData, Availability_SetFormData, Invitees_FormData, Availability_SetFormDataFinal } from './scheduleInterfaces';
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
  const [value, setValue] = React.useState<Dayjs | null>(dayjs());
  const [valueDuration, setDuration] = React.useState<Dayjs | null>(dayjs('2024-04-01T00:30'));
  const [availabilities, setAvailabilities] = useState<Availability_SetFormData[]>([]);
  const [selectedAvailabilities, setSelectedAvailabilities] = useState<Availability_SetFormData[]>([])
  const [contact, setContacts] =  useState<Contact[]>([]);

  const handleAddAvailability = () => {
    if (value && valueDuration) {
      const hour = valueDuration.hour();
      const minutes = valueDuration.minute();

      //End Date Computation:
      const addingEndDateHours = value.add(hour,'hours')
      const addingEndDateMinutes = addingEndDateHours.add(minutes,'minutes')
      
      // Check if the start date already exists in availabilities
      const startDateExists = availabilities.some(availability => {
        // Use Dayjs methods for date comparison
        return dayjs(availability.start_time).isSame(value, 'hours') &&
              dayjs(availability.start_time).isSame(value, 'minutes');
      });

      if (startDateExists) {
        // Alert user or handle duplicate start date scenario
        console.log("Availability with this start date already exists.");
      } else {
        
        const newAvailability:Availability_SetFormData = {
          start_time: value,
          end_time: addingEndDateMinutes,
        };

        // Update availabilities and selectedAvailabilities state
        setAvailabilities([...availabilities, newAvailability]);
        setSelectedAvailabilities([...selectedAvailabilities, newAvailability]);
      }
    }
  };

  const handleSubmit = () => {
    //Convert contacts to invitee form data
    const invitees: Invitees_FormData[] = contact.map(contact => ({
      contact: contact.id,
    }));

    const availabilitiesFinal: Availability_SetFormDataFinal[] = availabilities.map(({ start_time, end_time }) => ({
      start_time: start_time.toISOString(), // Convert to ISO 8601 format
      end_time: end_time.toISOString(), // Convert to ISO 8601 format
    }))

    if(valueDuration){
      const calendarFormData: ScheduleFormData ={
        title: title,
        description: description,
        duration: valueDuration.format('HH:mm:ss'),
        availability_set: availabilitiesFinal,
        invitees: invitees,
      }
      console.log(calendarFormData)
      onSubmit(calendarFormData);
      onClose();
    }
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
          <Button onClick={handleAddAvailability}>Add Time Slot</Button>
          <Autocomplete
              multiple
              id="tags-standard"
              options = {availabilities}
              getOptionLabel={(option) => (option.start_time.subtract(4, 'hour')).toString()}
              value={selectedAvailabilities} // Use controlled value
              onChange={(event, newValue) => {
                // Remove deselected availabilities from availabilities list
                const updatedAvailabilities = availabilities.filter(availability =>
                  newValue.includes(availability)
                );
                setAvailabilities(updatedAvailabilities);
                setSelectedAvailabilities(newValue);
              }}
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
              onChange={(event, value) => setContacts(value)} // prints the selected value
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
          <Button style={{ textTransform: 'none', fontSize: '1rem', padding: '5px 10px' }} onClick={onClose}>Cancel</Button>
          <Button style={{ textTransform: 'none', fontSize: '1rem', padding: '5px 10px' }} onClick={handleSubmit} color="primary">Add Schedule</Button>
        </DialogActions>
      </Dialog>
    </LocalizationProvider>
  );
};

export default AddScheduleModal;
