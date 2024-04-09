import { Checkbox, FormControlLabel, MenuItem, Select } from '@mui/material';
import React, { useState, useEffect } from 'react';

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

const InviteeLandingPage: React.FC<InviteeLandingPageProps> = ({token}) => {
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

  const handleCheckboxChange = (availabilityId: number, priority: number, isChecked: boolean) => {
    setSelectedTimes((prevSelectedTimes) => {
      if (!isChecked) {
        // If the checkbox is unchecked, remove the availability from selectedTimes
        return prevSelectedTimes.filter(
          (item) => item.availability !== availabilityId
        );
      } else {
        // If the checkbox is checked, add the availability to selectedTimes
        return [...prevSelectedTimes, { availability: availabilityId, priority }];
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

  const [selectedPriority, setSelectedPriority] = useState(1); // Initial state is low priority

  return (
    <div style={mainContainerStyle}>
      <h1 style={headerStyle}>Select Your Available Times</h1>
      <form onSubmit={handleSubmit} style={formStyle}>
        {availableTimes.map((time) => (
          <div>
          <FormControlLabel
            control={
              <Checkbox
                checked={selectedTimes.some(st => st.availability === time.id)}
                onChange={(e) => handleCheckboxChange(time.id, selectedPriority, e.target.checked)} // Adjust priority as needed
              />
            }
            label={`${new Date(time.start_time).toDateString()}: ${new Date(time.start_time).toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit' })} - ${new Date(time.end_time).toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit' })}`}
          />
          <Select
            value={selectedPriority === 1 ? 'low' : 'high'}
            onChange ={(event) => setSelectedPriority(event.target.value === 'high' ? 2 : 1)}
          >
            <MenuItem value="low">Low</MenuItem>
            <MenuItem value="high">High</MenuItem>
          </Select>
        </div>
        ))}
        <button type="submit" style={submitButtonStyle}>Submit</button>
      </form>
      {showModal && (
        <div style={modalBackdropStyle} onClick={closeModal}>
          <div style={modalContentStyle} onClick={(e) => e.stopPropagation()}>
            <p>Thank you for filling out your availability. The organizer of the event will be notified.</p>
            <button onClick={closeModal}>OK</button>
          </div>
        </div>
      )}
    </div>
  );
};

export default InviteeLandingPage;
