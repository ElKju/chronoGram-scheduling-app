import React, { useState, useEffect } from 'react';
import { Breadcrumbs, Button, CircularProgress, Link } from '@mui/material';
import { DataGrid, GridColDef } from '@mui/x-data-grid';
import AddIcon from '@mui/icons-material/Add';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import { Contact } from '../contacts/contactInterfaces';
import { Availability_Set, Calendar, Invitees, ScheduleFormData } from './scheduleInterfaces';
import AddScheduleModal from './AddScheduleModal';
import EditScheduleModal from './EditScheduleModal';
import dayjs, { Dayjs } from 'dayjs';
import { useNavigate } from 'react-router-dom';
import NavigateNextIcon from '@mui/icons-material/NavigateNext';

const ManageSchedules: React.FC = () => {
  
  const [contacts, setContacts] = useState<Contact[]>([]);
  const [schedules, setSchedules] = useState<Calendar[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [totalSchedules, setTotalSchedules] = useState<number>(0);
  const [isAddScheduleModalOpen, setIsAddScheduleModalOpen] = useState<boolean>(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState<boolean>(false);
  const navigate = useNavigate();
  
  const availability: Availability_Set = {
    id: 1,
    start_time: dayjs(),
    end_time: dayjs(),
  }
  const inviteeInit: Invitees = {
    contact:111111111111,
    calendar: 111111111111,
    availability_sets: [availability],
    random_link_token:"djkdkjdkfjfdkfkdj",
  }
  const scheduleInit: Calendar = {
    id:111111111111,
    owner: 123,
    title: "testing",
    description: "testing123",
    duration: dayjs().toISOString(),
    availability_set: [availability],
    invitees: [inviteeInit]
  }
  const [selectedSchedule, setSelectedSchedule] = useState<Calendar>(scheduleInit);


  useEffect(() => {
    fetchSchedules('http://127.0.0.1:8000/calendars/');
  }, []);

  const fetchSchedules = async (url: string) => {
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
      setTotalSchedules(data.length);
      const schedulesWithIds = data.map((schedule: Calendar) => ({ ...schedule}));
      setSchedules(schedulesWithIds);

      const responseContacts = await fetch('http://127.0.0.1:8000/contacts/list/all', {
        method: 'GET',
        headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
      });

      const dataContacts = await responseContacts.json();
      const contactsWithId = dataContacts.map((contact: Contact) => ({ ...contact}));
      setContacts(contactsWithId);
      setLoading(false);
      setError(null);

    } catch (error) {
      console.error('An error occurred:', error);
      setError('Failed to fetch schedules. Please try again later.');
      setLoading(false);
    }
  };

  const columns: GridColDef[] = [
    { field: 'title', headerName: 'Title', width: 150, headerAlign: 'center', align: 'center'},
    { field: 'description', headerName: 'Description', width: 150, headerAlign: 'center', align: 'center'},
    { field: 'duration', headerName: 'Duration', width: 150, headerAlign: 'center', align: 'center'},
    { field: 'finalized', headerName: 'Status', width: 150, headerAlign: 'center', align: 'center',
      renderCell: (params) => (
        <span>
          {params.value ? 'Finalized' : 'Unfinalized'}
        </span>
      )
    },
    {
      field: 'actions',
      headerName: 'Actions',
      headerAlign: 'center',
      width: 175,
      renderCell: (params) => (
        <div style={{ display: 'flex', alignItems: 'center' }}>
          <Button 
            style={{ textTransform: 'none', fontSize: '1rem' }} 
            startIcon={<EditIcon />} 
            onClick={() => handleEditButtonClick(params.row.id)}>Edit</Button>
            <EditScheduleModal
              open={isEditModalOpen}
              onClose={() => setIsEditModalOpen(false)}
              onSubmit={handleEditSchedule} 
              contacts={contacts}
              calendar={selectedSchedule}/>
          <Button 
            style = {{textTransform: 'none', fontSize:'1rem'}} 
            startIcon = {<DeleteIcon/>} 
            onClick={() => handleDelete(params.row.id)}>Delete</Button>
        </div>
      ),
      
    },
  ];

  const handleAddCalendar = async (scheduleData: ScheduleFormData) => {
    try {
      const token = localStorage.getItem('accessToken');
      const response = await fetch(`http://127.0.0.1:8000/calendars/`, {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(scheduleData),
      });
      if (!response.ok) {
        throw new Error('Failed to add schedules');
      }
    } catch (error) {
      console.error('Error adding schedules:', error);
    }
    setIsAddScheduleModalOpen(false);
    window.location.reload()
  };

  const handleEditButtonClick = (scheduleId: number) => {
    const scheduleSelected = schedules.find(schedule => schedule.id === scheduleId);
    if (scheduleSelected!==null && scheduleSelected!==undefined) {
      // If the contact is found, set it as the selected contact and open the edit modal
      setSelectedSchedule(scheduleSelected);
      setIsEditModalOpen(true);
    } else {
      console.error(`Contact with ID ${scheduleId} not found.`);
    }
  };

  const handleEditSchedule = async (formData: ScheduleFormData, scheduleId: number) => {
    try {
      const token = localStorage.getItem('accessToken');
      const response = await fetch(`http://127.0.0.1:8000/calendars/${scheduleId}/`, {
        method: 'PUT',
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });
      if (!response.ok) {
        throw new Error('Failed to edit schedule');
      }
    } catch (error) {
      console.error('Error editing schedule:', error);
    }
    setIsEditModalOpen(false);
    window.location.reload()
  };

  const handleDelete = async (calendarId: number) => {
    try {
      const token = localStorage.getItem('accessToken');
      const response = await fetch(`http://127.0.0.1:8000/calendars/${calendarId}/`, {
        method: 'DELETE',
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      });
      if (!response.ok) {
        throw new Error('Failed to delete calendar');
      }
    } catch (error) {
      console.error('Error deleting calendar:', error);
    }
    window.location.reload()
  };

  if (loading) {
    return <CircularProgress />;
  }

  if (error) {
    return <div>Error: {error}</div>;
  }

  const handleButtonClick = (event: React.MouseEvent<HTMLAnchorElement, MouseEvent>) => {
    event.preventDefault();
    navigate('/main'); 
  };

  const breadcrumbs = [
    <Link underline="hover" key="1" color="inherit" href="/" onClick={handleButtonClick}>Main Page</Link>,
    <Link underline="hover" key="2" color="inherit">Manage Schedules</Link>,
  ];

  return (
    <div
      style={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
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
      <h1>Manage Schedules</h1>
      <br/>
      <div style={{ flex: '1', overflowY: 'auto' }}>
      <div style={{ marginBottom: '1rem', display: 'flex', justifyContent: 'flex-start' }}>
      <Button
        variant="contained"
        startIcon={<AddIcon />}
        onClick={() => setIsAddScheduleModalOpen(true)}
        style={{ textTransform: 'none', fontSize: '1rem', padding: '5px 10px' }}
      >
        Create Schedule
      </Button>
      <AddScheduleModal
        open={isAddScheduleModalOpen}
        onClose={() => setIsAddScheduleModalOpen(false)}
        onSubmit={handleAddCalendar}
        contacts = {contacts}
      />
      </div>
        <DataGrid 
          rowCount={totalSchedules} 
          rows={schedules} 
          columns={columns}
          initialState={{
            pagination: {
              paginationModel: {
                pageSize: 10,
              },
            },
          }}
          paginationMode="client"
          pageSizeOptions={[10]}
        />
      </div>
    </div>
  );
};

export default ManageSchedules;