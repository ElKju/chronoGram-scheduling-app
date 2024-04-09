import React, { useState, useEffect } from 'react';
import emailjs from 'emailjs-com';

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

const InviteeLandingPage: React.FC<InviteeLandingPageProps> = ({ token }) => {
  const [availableTimes, setAvailableTimes] = useState<Availability[]>([]);
  const [selectedTimes, setSelectedTimes] = useState<SelectedAvailability[]>([]);
  const [noneWork, setNoneWork] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [calendarDetails, setCalendarDetails] = useState({
    calendarName: '',
    inviteeFirstName: '',
    inviteeLastName: '',
    inviteeEmail: '',
    calendarOwnerEmail: ''
  });

  useEffect(() => {
    const fetchInviteeAndCalendarDetails = async () => {
      const response = await fetch(`http://127.0.0.1:8000/invitee/${token}/`);
      const data = await response.json();
      setCalendarDetails({
        calendarName: data.calendar.title,
        inviteeFirstName: data.contact.first_name,
        inviteeLastName: data.contact.last_name,
        inviteeEmail: data.contact.email_address,
        calendarOwnerEmail: data.calendar.owner.email_address
      });

      setAvailableTimes(data.calendar.availability_set);
    };
    fetchInviteeAndCalendarDetails();
  }, [token]);

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    let emailParams;
    if (noneWork) {
      emailParams = {
        calendar_name: calendarDetails.calendarName,
        invitee_first_name: calendarDetails.inviteeFirstName,
        invitee_last_name: calendarDetails.inviteeLastName,
        invitee_email: calendarDetails.inviteeEmail,
        owner_email: calendarDetails.calendarOwnerEmail,
        message: `${calendarDetails.inviteeFirstName} ${calendarDetails.inviteeLastName} says none of the proposed times work for them.`,
      };
    } else {
      const selectedTime = availableTimes.find((time) => selectedTimes.some((st) => st.availability === time.id));
      const formattedTime = selectedTime
        ? `${new Date(selectedTime.start_time).toLocaleTimeString()} - ${new Date(selectedTime.end_time).toLocaleTimeString()}`
        : 'No time selected';

      emailParams = {
        calendar_name: calendarDetails.calendarName,
        invitee_first_name: calendarDetails.inviteeFirstName,
        invitee_last_name: calendarDetails.inviteeLastName,
        invitee_email: calendarDetails.inviteeEmail,
        owner_email: calendarDetails.calendarOwnerEmail,
        message: selectedTime
          ? `${calendarDetails.inviteeFirstName} ${calendarDetails.inviteeLastName} has RSVP'd to the time slot: ${formattedTime}`
          : `${calendarDetails.inviteeFirstName} ${calendarDetails.inviteeLastName} has not selected a time slot, as non of the proposed times are adequite.`,
      };

      if (selectedTime) {
        const payload = {
          selected_availability: selectedTimes,
        };
        await fetch(`http://127.0.0.1:8000/invitee/${token}/`, {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(payload),
        });
      }
    }

    emailjs.send('service_owlenh6', 'template_qluuhjo', emailParams, 'YfVD5noQjipeCRFbx')
      .then(
        (response) => {
          console.log('SUCCESS!', response.status, response.text);
          setShowModal(true);
        },
        (err) => {
          console.error('FAILED...', err);
        }
      );
  };

  const handleCheckboxChange = (availabilityId: number, priority: number) => {
    setNoneWork(false);
    setSelectedTimes((prevSelectedTimes) => {
      const isSelected = prevSelectedTimes.some((item) => item.availability === availabilityId);
      if (isSelected) {
        return prevSelectedTimes.filter((item) => item.availability !== availabilityId);
      } else {
        return [...prevSelectedTimes, { availability: availabilityId, priority }];
      }
    });
  };

  useEffect(() => {
    if (noneWork) {
      setSelectedTimes([]);
    }
  }, [noneWork]);

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
    justifyContent: 'flex-start',
    paddingTop: '5vh',
    minHeight: '100vh',
    padding: '20px',
  };

  const headerStyle: React.CSSProperties = {
    textAlign: 'center',
    margin: '0 0 20px 0',
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
    padding: '1rem 2rem',
    fontSize: '1rem',
    backgroundColor: '#0056b3',
    color: 'white',
    border: 'none',
    borderRadius: '4px',
    cursor: 'pointer',
    marginTop: '20px',
    width: '50%',
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
                checked={selectedTimes.some((st) => st.availability === time.id)}
                onChange={() => handleCheckboxChange(time.id, 1)}
              />
              {new Date(time.start_time).toLocaleTimeString()} - {new Date(time.end_time).toLocaleTimeString()}
            </label>
          </div>
        ))}
        <div style={timeSlotStyle}>
          <label>
            <input
              type="checkbox"
              checked={noneWork}
              onChange={() => setNoneWork(!noneWork)}
            />
            None of these times work for me
          </label>
        </div>
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
