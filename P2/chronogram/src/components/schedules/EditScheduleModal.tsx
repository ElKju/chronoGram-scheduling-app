import React, { useEffect, useMemo, useState } from 'react';
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
import { ScheduleFormData, Availability_SetFormData, Invitees_FormData, Availability_SetFormDataFinal, Calendar, Availability_Set, EditedScheduleFormData } from './scheduleInterfaces';
import dayjs, { Dayjs } from 'dayjs';
import { Contact } from '../contacts/contactInterfaces';
import { TimeField } from '@mui/x-date-pickers';

interface EditScheduleModalProps {
  open: boolean;
  onClose: () => void;
  onSubmit: (formData: ScheduleFormData, scheduleId: number) => void;
  contacts: Contact[];
  calendar: Calendar;
}

const EditScheduleModal: React.FC<EditScheduleModalProps> = ({ open, onClose, onSubmit, contacts, calendar }) => {

    const [originalTitle, setOriginalTitle] = useState(calendar.title);
    const [originalDescription, setOriginalDescription] = useState(calendar.description);
    const [originalDuration, setOriginalDuration] = useState(calendar.duration);
    const [originalAvailabilities, setOriginalAvailabilities] = useState(calendar.availability_set);
    const [originalInvitees, setOriginalInvitees] = useState(calendar.invitees);
    const [newDuration, setNewDuration] = useState<Dayjs | null>(dayjs(originalDuration, 'HH:mm:ss'));
    const [newTimeSlot, setNewTimeSlot] = useState<Dayjs | null>(dayjs());
    const availabilityInit: Availability_SetFormData = {
      start_time: dayjs(),
      end_time: dayjs(),
    }
    const [availabilities, setAvailabilities] = useState<Availability_SetFormData[]>([availabilityInit]);
    const [selectedAvailabilities, setSelectedAvailabilities] = useState<Availability_SetFormData[]>([]);
    const [currentContacts, setCurrentContacts] = useState<Contact[]>([]);

    useEffect(() => {
      if (calendar!= null) {
        setOriginalTitle(calendar.title);
        setOriginalDescription(calendar.description);
        setOriginalDuration(calendar.duration)
        setOriginalAvailabilities(calendar.availability_set)
        setOriginalInvitees(calendar.invitees)
      }
    },[calendar]);
    
    useMemo(() => {
        setNewDuration(dayjs(originalDuration, 'HH:mm:ss'));
    }, [originalDuration]);

    useMemo(() => {
      const availabilities = originalAvailabilities.map((availability: Availability_Set) => ({
        start_time: dayjs(availability.start_time),
        end_time: dayjs(availability.end_time),
      }))
      setAvailabilities(availabilities)
      
    }, [originalAvailabilities]);

    useMemo(() => {
      const matchingContactIds = originalInvitees.map(invitee => invitee.contact);
      const originalContacts =  contacts.filter(contact => matchingContactIds.includes(contact.id));
      setCurrentContacts(originalContacts)
    }, [originalInvitees]);

    const handleDurationChange = (newValue: Dayjs | null) => {
      setNewDuration(newValue);
    };

    const handleAddAvailability = () => {
      
      if (newTimeSlot && newDuration) {
        const hour = newDuration.hour();
        const minutes = newDuration.minute();

        //End Date Computation:
        const addingEndDateHours = newTimeSlot.add(hour,'hours')
        const addingEndDateMinutes = addingEndDateHours.add(minutes,'minutes')
        
        // Check if the start date already exists in availabilities
        const startDateExists = availabilities.some(availability => {
          // Use Dayjs methods for date comparison
          return dayjs(availability.start_time).isSame(newTimeSlot, 'hours') &&
                dayjs(availability.start_time).isSame(newTimeSlot, 'minutes');
        });

        if (startDateExists) {
          // Alert user or handle duplicate start date scenario
          console.log("Availability with this start date already exists.");
        } else {
          
          const newAvailability:Availability_SetFormData = {
            start_time: newTimeSlot,
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
      const invitees: Invitees_FormData[] =  currentContacts.map(contact => ({
        contact: contact.id,
      }));
  
      const availabilitiesFinal: Availability_SetFormDataFinal[] = availabilities.map(({ start_time, end_time }) => ({
        start_time: start_time.toISOString(), // Convert to ISO 8601 format
        end_time: end_time.toISOString(), // Convert to ISO 8601 format
      }))
  
      if(newDuration){
        const calendarFormData: EditedScheduleFormData ={
          owner:calendar.owner,
          title: originalTitle,
          description: originalDescription,
          duration: newDuration.format('HH:mm:ss'),
          availability_set: availabilitiesFinal,
          invitees: invitees,
        }
        console.log(calendarFormData)
        onSubmit(calendarFormData, calendar.id);
        onClose();
      }
    };

  const onCloseModal = () => {
    console.log(newDuration)
    console.log(currentContacts)
    setNewDuration(dayjs(originalDuration, 'HH:mm:ss'))
    onClose();
  }

  return (
    <LocalizationProvider dateAdapter={AdapterDayjs}>
      <Dialog open={open} onClose={onClose}>
        <DialogTitle>Edit Schedule</DialogTitle>
        <DialogContent>
          <TextField
            label="Title"
            name="title"
            value={originalTitle}
            onChange={(e) => setOriginalTitle(e.target.value)}
            fullWidth
            margin="normal"
          />
          <TextField
            label="Description"
            name="description"
            value={originalDescription}
            onChange={(e) => setOriginalDescription(e.target.value)}
            fullWidth
            margin="normal"
          />
          <br/>
          <br/>
          <TimeField
            label="Duration"
            defaultValue={newDuration}
            value={newDuration}
            format="HH:mm"
            onChange={handleDurationChange}
            />
          <br/>
          <br/>
          <DateTimePicker
            label="Available Time"
            defaultValue={null}
            value={newTimeSlot}
            onChange={(newValue) => setNewTimeSlot(newValue)}
          />
          <Button onClick={handleAddAvailability}>Add Time Slot</Button>
          <Autocomplete
              multiple
              id="tags-standard"
              options = {availabilities}
              getOptionLabel={(option) => {
                const formattedStartTime = dayjs(option.start_time).format('ddd, DD MMM YYYY HH:mm:ss [GMT]');
                return formattedStartTime;
              }} 
              value={availabilities}
              renderInput={(params) => (
                <TextField
                  {...params}
                  variant="standard"
                  label="Selected Time Slots"
                  placeholder="Availabilities"
                />
              )}
              onChange={(event, newValue) => {
                const updatedAvailabilities = availabilities.filter(availability =>
                  newValue.includes(availability)
                );
                setAvailabilities(updatedAvailabilities);
                setSelectedAvailabilities(newValue);
              }}
            />
          <Autocomplete
              multiple
              id="tags-standard1"
              options = {contacts}
              getOptionLabel={(option) => option.first_name}
              defaultValue={currentContacts}
              value = {currentContacts}
              onChange={(event, value) => setCurrentContacts(value)} 
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
          <Button style={{ textTransform: 'none', fontSize: '1rem', padding: '5px 10px' }} onClick={onCloseModal}>Cancel</Button>
          <Button style={{ textTransform: 'none', fontSize: '1rem', padding: '5px 10px' }} onClick={handleSubmit} color="primary">Save</Button>
        </DialogActions>
      </Dialog>
    </LocalizationProvider>
  );
};

export default EditScheduleModal;
