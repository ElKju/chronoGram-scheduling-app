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
  const [timeSlot, setTimeSlot] = React.useState<Dayjs | null>(dayjs());
  const [duration, setDuration] = React.useState<Dayjs | null>(dayjs('2024-04-01T00:30'));
  const [availabilities, setAvailabilities] = useState<Availability_SetFormData[]>([]);
  const [selectedAvailabilities, setSelectedAvailabilities] = useState<Availability_SetFormData[]>([])
  const [contact, setContacts] =  useState<Contact[]>([]);

  // State variables for validation errors
  const [titleError, setTitleError] = useState('');
  const [descriptionError, setDescriptionError] = useState('');
  const [timeSlotError, setTimeSlotError] = useState('');
  const [contactsError, setContactsError] = useState('');


  const handleAddAvailability = () => {
    if (timeSlot && duration) {
      const hour = duration.hour();
      const minutes = duration.minute();

      //End Date Computation:
      const addingEndDateHours = timeSlot.add(hour,'hours')
      const addingEndDateMinutes = addingEndDateHours.add(minutes,'minutes')
      
      // Check if the start date already exists in availabilities
      const startDateExists = availabilities.some(availability => {
        // Use Dayjs methods for date comparison
        return dayjs(availability.start_time).isSame(timeSlot, 'hours') &&
              dayjs(availability.start_time).isSame(timeSlot, 'minutes');
      });

      if (startDateExists) {
        // Alert user or handle duplicate start date scenario
        console.log("Availability with this start date already exists.");
      } else {
        
        const newAvailability:Availability_SetFormData = {
          start_time: timeSlot,
          end_time: addingEndDateMinutes,
        };

        // Update availabilities and selectedAvailabilities state
        setAvailabilities([...availabilities, newAvailability]);
        setSelectedAvailabilities([...selectedAvailabilities, newAvailability]);
      }
    }
  };

  const handleSubmit = () => {

     // Clear previous validation errors
     setTitleError('');
     setDescriptionError('');
     setTimeSlotError('');
     setContactsError('');
 
     // Check for validation errors
     let isValid = true;
     if (!title) {
       setTitleError('Title is required');
       isValid = false;
     }
     if (!description) {
       setDescriptionError('Description is required');
       isValid = false;
     }
     if (availabilities.length===0) {
      setTimeSlotError('At least one timeslot is required');
      isValid = false;
    }
    if (contact.length===0) {
      setContactsError('At least one contact is required');
      isValid = false;
    }


     if (!isValid) {
      return;
    }


    //Convert contacts to invitee form data
    const invitees: Invitees_FormData[] = contact.map(contact => ({
      contact: contact.id,
    }));

    const availabilitiesFinal: Availability_SetFormDataFinal[] = availabilities.map(({ start_time, end_time }) => ({
      start_time: start_time.toISOString(), // Convert to ISO 8601 format
      end_time: end_time.toISOString(), // Convert to ISO 8601 format
    }))

    if(duration){
      const calendarFormData: ScheduleFormData ={
        title: title,
        description: description,
        duration: duration.format('HH:mm:ss'),
        availability_set: availabilitiesFinal,
        invitees: invitees,
      }
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
            error={!!titleError}
            helperText={titleError}
          />
          <TextField
            label="Description"
            name="description"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            fullWidth
            margin="normal"
            error={!!descriptionError}
            helperText={descriptionError}
          />
          <br/>
          <br/>
          <TimeField
            label="Duration"
            defaultValue={dayjs('2022-04-17T15:30')}
            value={duration}
            format="HH:mm"
            onChange = {(newValue) => setDuration(newValue)}
          />
          <br/>
          <br/>
          <DateTimePicker
            label="Available Time"
            defaultValue={null}
            value={timeSlot}
            onChange={(newValue) => setTimeSlot(newValue)}
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
                  error={!!timeSlotError}
                  helperText={timeSlotError}
                />
              )}
            />

          <Autocomplete
              multiple
              id="tags-standard1"
              options = {contacts}
              getOptionLabel={(option) => option.first_name}
              defaultValue={[]}
              onChange={(event, value) => setContacts(value)} 
              renderInput={(params) => (
                <TextField
                  {...params}
                  variant="standard"
                  label="Invite Contacts"
                  placeholder="Invite Contacts"
                  error={!!contactsError}
                  helperText={contactsError}
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
