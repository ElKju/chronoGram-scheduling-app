import React, { useState, useEffect } from 'react';
import dayjs from 'dayjs';
import {
  Container,
  Typography,
  Checkbox,
  FormControlLabel,
  Radio,
  RadioGroup,
  FormControl,
  FormLabel,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogContentText,
  DialogActions,
  Box,
  Paper
} from '@mui/material';

interface Availability {
  id: number;
  start_time: string;
  end_time: string;
}

interface SelectedAvailability {
  availability: number;
  priority: number;
}

interface InviteeLandingPageProps {
  token: string;
}

/*const mockAvailableTimes = [
  {
    id: 1,
    start_time: new Date().toISOString(),
    end_time: new Date(new Date().getTime() + 1 * 60 * 60 * 1000).toISOString(), // Plus 1 hour
  },
  {
    id: 2,
    start_time: new Date().toISOString(),
    end_time: new Date(new Date().getTime() + 2 * 60 * 60 * 1000).toISOString(), // Plus 2 hours
  },
  {
    id: 3,
    start_time: new Date().toISOString(),
    end_time: new Date(new Date().getTime() + 2 * 60 * 60 * 1000).toISOString(), // Plus 2 hours
  },
  // Add more mock time slots as needed
];*/

const InviteeLandingPage: React.FC<InviteeLandingPageProps> = ({ token }) => {
  //const [availableTimes, setAvailableTimes] = useState<Availability[]>([]);
  const [availableTimes, setAvailableTimes] = useState<Availability[]>([]);
  const [selectedTimes, setSelectedTimes] = useState<SelectedAvailability[]>([]);

  useEffect(() => {
    const fetchAvailableTimes = async () => {
      const response = await fetch(`http://127.0.0.1:8000/invitee/${token}/`);
      const data = await response.json();
      setAvailableTimes(data);
    };
    fetchAvailableTimes();
  }, [token]);

  const [showModal, setShowModal] = useState(false);

  const formatTimeRange = (start: string, end: string) => {
    return `${dayjs(start).format('ddd, D MMM YYYY HH:mm:ss')} - ${dayjs(end).format('HH:mm:ss')} GMT`;
  };

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    const payload = {
      selected_availability: selectedTimes,
    };
    const response = await fetch(`http://127.0.0.1:8000/invitee/${token}/`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(payload),
    });
    const data = await response.json();
    console.log(data); // Handle the response as needed
    setShowModal(true);
  };

  const handlePriorityChange = (availabilityId: number, newPriority: number) => {
    setSelectedTimes((prevSelectedTimes) => {
      return prevSelectedTimes.map((time) => {
        if (time.availability === availabilityId) {
          return { ...time, priority: newPriority };
        }
        return time;
      });
    });
  };

  const handleCheckboxChange = (availabilityId: number) => {
    setSelectedTimes((prevSelectedTimes) => {
      const isSelected = prevSelectedTimes.some((item) => item.availability === availabilityId);
      if (isSelected) {
        // If it's already selected, remove it (set priority to 0)
        return prevSelectedTimes.filter((item) => item.availability !== availabilityId);
      } else {
        // If it's not selected, add it with the lowest priority by default
        return [...prevSelectedTimes, { availability: availabilityId, priority: 1 }];
      }
    });
  };


  const closeModal = () => {
    setShowModal(false);
  };

  const modalBackdropStyle: React.CSSProperties = {
    position: 'fixed',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 1000,
  };

  // Style for the modal content
  const modalContentStyle: React.CSSProperties = {
    backgroundColor: '#fff',
    padding: '20px',
    borderRadius: '5px',
    boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)',
    textAlign: 'center',
  };

  const mainContainerStyle: React.CSSProperties = {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'flex-start', // Aligns content to the top
    paddingTop: '5vh', // Adds some padding at the top
    minHeight: '100vh',
    padding: '20px',
  };

  const headerStyle: React.CSSProperties = {
    textAlign: 'center',
    margin: '0 0 20px 0', // Less margin on the top
    fontSize: '2rem',
  };

  const formStyle: React.CSSProperties = {
    width: '100%',
    maxWidth: '500px',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
  };

  const timeSlotStyle: React.CSSProperties = {
    width: '100%',
    marginBottom: '10px',
  };

  const submitButtonStyle: React.CSSProperties = {
    padding: '1rem 2rem', // Reduced horizontal padding
    fontSize: '1rem',
    backgroundColor: '#0056b3',
    color: 'white',
    border: 'none',
    borderRadius: '4px',
    cursor: 'pointer',
    marginTop: '20px',
    width: '50%', // Reduces the width of the button
  };

  return (
    <Container maxWidth="md" style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
      <Box sx={{ mt: 4 }}> {/* Add margin top */}
        <Typography variant="h4" align="center" gutterBottom style={{ fontWeight: 'bold' }}>
          Select Your Available Times
        </Typography>
        <form onSubmit={handleSubmit}>
          {availableTimes.map((time, index) => (
            <Paper key={time.id} elevation={2} style={{ padding: '20px', marginTop: index === 0 ? '2rem' : '10px' }}>
              <Box display="flex" flexDirection="column" alignItems="center" mb={2}>
                <FormControlLabel
                  control={
                    <Checkbox
                      checked={selectedTimes.some((st) => st.availability === time.id)}
                      onChange={() => handleCheckboxChange(time.id)}
                      name={`time-${time.id}`}
                    />}
                  label={formatTimeRange(time.start_time, time.end_time)}
                  labelPlacement="end"
                />
                <FormControl component="fieldset">
                  <RadioGroup
                    row
                    aria-label="priority"
                    name={`priority-${time.id}`}
                    value={
                      selectedTimes.find((st) => st.availability === time.id)?.priority || 0
                    }
                    onChange={(event) => handlePriorityChange(time.id, parseInt(event.target.value))}
                  >
                    <FormControlLabel value={2} control={<Radio />} label="High Priority" style={{ color: 'gray' }} />
                    <FormControlLabel value={1} control={<Radio />} label="Low Priority" style={{ color: 'gray' }} />
                  </RadioGroup>
                </FormControl>
              </Box>
            </Paper>
          ))}
          <Box display="flex" justifyContent="center" mt={4}> {/* Increased margin top for the submit button */}
            <Button type="submit" variant="contained" color="primary">
              Submit
            </Button>
          </Box>
        </form>
      </Box>

    </Container>
  );
};

export default InviteeLandingPage;
