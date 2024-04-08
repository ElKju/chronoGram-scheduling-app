import React, { useState, useEffect } from 'react';
import { Dialog, DialogTitle, DialogContent, DialogActions, Button, TextField, Typography } from '@mui/material';
import { suggestedSchedules } from '../finalizedSchedules/suggestedSchedulesInterfaces';
import { Calendar } from './scheduleInterfaces';
import dayjs, { Dayjs } from 'dayjs';

interface ViewScheduleModalProps {
  open: boolean;
  onClose: () => void;
  suggestedSchedule: suggestedSchedules[];
  calendar: Calendar;
}

const ViewScheduleModal: React.FC<ViewScheduleModalProps> = ({ open, onClose, suggestedSchedule, calendar }) => {

    return (
        <Dialog open={open} onClose={onClose}>
        <DialogTitle>View Schedule</DialogTitle>
        <DialogContent>
            <TextField
            label="Title"
            value={calendar.title}
            fullWidth
            margin="normal"
            InputProps={{
                readOnly: true,
            }}
            />
            <TextField
            label="Description"
            value={calendar.description}
            fullWidth
            margin="normal"
            InputProps={{
                readOnly: true,
            }}
            />
            <TextField
            label="Duration"
            value={calendar.duration}
            fullWidth
            margin="normal"
            InputProps={{
                readOnly: true,
            }}
            />
             <Typography variant="h6">Schedule</Typography>
                  {suggestedSchedule[0].events.map((event, eventIndex) => (
                    <div key={eventIndex}>
                      <Typography variant="subtitle1">
                        <u>{`${event.invitee_details.first_name} ${event.invitee_details.last_name}`}</u>
                      </Typography>
                      <Typography variant="body2">
                        {`Start Time: ${dayjs(event.availability_details.start_time).format('YYYY-MM-DD HH:mm')}`}
                      </Typography>
                      <Typography variant="body2">
                        {`End Time: ${dayjs(event.availability_details.end_time).format('YYYY-MM-DD HH:mm')}`}
                      </Typography>
                    </div>
                  ))}
        </DialogContent>
        <DialogActions>
            <Button onClick={onClose}>Cancel</Button>
        </DialogActions>
        </Dialog>
    );
};

export default ViewScheduleModal;
