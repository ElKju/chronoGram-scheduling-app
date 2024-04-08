import React, { useState, useEffect } from 'react';
import { Breadcrumbs, Button, Card, CardContent, CircularProgress, Grid, Link, Typography } from '@mui/material';
import NavigateNextIcon from '@mui/icons-material/NavigateNext';

import dayjs from 'dayjs';
import { suggestedSchedules } from './suggestedSchedulesInterfaces';
import { useNavigate } from 'react-router-dom';

interface SelectSuggestedSchedulePageProps {
  token: string;
}

const SelectSuggestedSchedule: React.FC<SelectSuggestedSchedulePageProps> = ({token}) => {
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [suggestedSchedules, setSuggestedSchedules] = useState<suggestedSchedules[]>([]);
  const navigate = useNavigate();
  
  useEffect(() => {
    fetchSuggestedSchedule(`http://127.0.0.1:8000/calendars/${token}/suggest/`);
  }, []);

  const fetchSuggestedSchedule = async (url: string) => {
    try {
      const token = localStorage.getItem('accessToken');

      const response = await fetch(url, {
        method: 'GET',
        headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
      });
      if (!response.ok) {
        throw new Error('Failed to fetch schedules');
      }

      const data = await response.json();
      const suggestedSchedulesInfo = data.map((schedule: suggestedSchedules) => ({ ...schedule}));
      setSuggestedSchedules(suggestedSchedulesInfo)
      setLoading(false);
    } catch (error) {
      console.error('An error occurred:', error);
      setError('Failed to fetch suggested schedules. Please try again later.');
      setLoading(false);
    }
  };

  if (loading) {
    return <CircularProgress />;
  }

  if (error) {
    return <div>Error: {error}</div>;
  }

  const handleBookNow = async (scheduleId: number) => {
    try {
      // Send PUT request with the specific schedule ID
      const token = localStorage.getItem('accessToken');
      const response = await fetch(`http://127.0.0.1:8000/calendars/${suggestedSchedules[0].calendar}/suggest/${scheduleId}/select/`, {
        method: 'PUT',
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      });
      console.log('PUT request response:', response);
    } catch (error) {
      console.error('Error sending PUT request:', error);
    }
    window.location.reload()
  };

  const handleButtonClick = (event: React.MouseEvent<HTMLAnchorElement, MouseEvent>) => {
    event.preventDefault();
    navigate('/main'); 
  };

  const breadcrumbs = [
    <Link underline="hover" key="1" color="inherit" href="/" onClick={handleButtonClick}>Main Page</Link>,
    <Link underline="hover" key="2" color="inherit">Select Schedule</Link>,
  ];

  return (
    <div
      style={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'flex-start', // Align items at the top
        minHeight: '100vh',
        paddingBottom: '3rem',
      }}
    >
       <Breadcrumbs
        sx={{ paddingTop:'20px'}}
        separator={<NavigateNextIcon fontSize="small" />}
        aria-label="breadcrumb"
      >
        {breadcrumbs}
      </Breadcrumbs>
      <h1 style={{ marginBottom: '1rem' }}>Select Suggested Schedule</h1>
      <div style={{ maxWidth: '800px', width: '100%' }}>
        <Grid container spacing={3}>
          {suggestedSchedules.map((schedule, index) => (
            <Grid item xs={4} key={index}>
              <Card>
                <CardContent>
                  <Typography variant="h6">Schedule {index + 1}</Typography>
                  {schedule.events.map((event, eventIndex) => (
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
                </CardContent>
                <Button
                  variant="contained"
                  color="primary"
                  onClick={() => handleBookNow(schedule.id)}
                >
                  Book Now
                </Button>
              </Card>
            </Grid>
          ))}
        </Grid>
      </div>
    </div>
  );
};

export default SelectSuggestedSchedule;