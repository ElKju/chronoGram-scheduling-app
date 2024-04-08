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

  const handleCheckboxChange = (availabilityId: number, priority: number) => {
    setSelectedTimes((prevSelectedTimes) => {
      const isSelected = prevSelectedTimes.some(
        (item) => item.availability === availabilityId
      );
      if (isSelected) {
        return prevSelectedTimes.filter(
          (item) => item.availability !== availabilityId
        );
      } else {
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

  return (
    <div style={mainContainerStyle}>
      <h1 style={headerStyle}>Select Your Available Times</h1>
      <form onSubmit={handleSubmit} style={formStyle}>
        {availableTimes.map((time) => (
          <div key={time.id} style={timeSlotStyle}>
            <label>
              <input
                type="checkbox"
                value={time.id}
                checked={selectedTimes.some(st => st.availability === time.id)}
                onChange={() => handleCheckboxChange(time.id, 1)} // Adjust priority as needed
              />
              {new Date(time.start_time).toLocaleTimeString()} - {new Date(time.end_time).toLocaleTimeString()}
            </label>
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
