import React, { useState, useEffect, useRef } from 'react';
import { Button, CircularProgress } from '@mui/material';
import { DataGrid, GridCallbackDetails, GridColDef, GridPaginationModel } from '@mui/x-data-grid';
import AddIcon from '@mui/icons-material/Add';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import EditContactModal from './EditContactModal';
import { Contact, ContactFormData } from '../contacts/contactInterfaces';
import { Calendar, ScheduleFormData } from './scheduleInterfaces';
import AddScheduleModal from './AddScheduleModal';

const ManageSchedules: React.FC = () => {
  
  const [contacts, setContacts] = useState<Contact[]>([]);
  const [schedules, setSchedules] = useState<Calendar[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [totalSchedules, setTotalSchedules] = useState<number>(0);
  let previousUrl = useRef<string | null>(null);
  let nextUrl = useRef<string | null>(null);
  const [isAddScheduleModalOpen, setIsAddScheduleModalOpen] = useState<boolean>(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState<boolean>(false);
  const contactInit: Contact = {
    id:111111111111,
    first_name: "testing",
    last_name: "testing",
    email_address: "testing@gmail.com"
  }
  const [selectedContact, setSelectedContact] = useState<Contact>(contactInit);
  const [url, setUrl] = useState<string>('http://127.0.0.1:8000/calendars/');


  useEffect(() => {
    fetchSchedules(url);
  }, [url]);

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
      const contactsWithId = dataContacts.results.map((contact: Contact) => ({ ...contact}));
      setContacts(contactsWithId);
      setLoading(false);
      setError(null);

    } catch (error) {
      console.error('An error occurred:', error);
      setError('Failed to fetch contacts. Please try again later.');
      setLoading(false);
    }
  };

  const columns: GridColDef[] = [
    { field: 'title', headerName: 'Title', width: 150, headerAlign: 'center', align: 'center'},
    { field: 'description', headerName: 'Description', width: 150, headerAlign: 'center', align: 'center'},
    { field: 'duration', headerName: 'Duration', width: 150, headerAlign: 'center', align: 'center'},
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
            <EditContactModal
              open={isEditModalOpen}
              onClose={() => setIsEditModalOpen(false)}
              onSubmit={handleEditContact} 
              contact={selectedContact}/>
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

  const handleEditButtonClick = (contactId: number) => {
    const selectedContact = contacts.find(contact => contact.id === contactId);
    if (selectedContact!==null && selectedContact!==undefined) {
      // If the contact is found, set it as the selected contact and open the edit modal
      setSelectedContact(selectedContact);
      setIsEditModalOpen(true);
    } else {
      console.error(`Contact with ID ${contactId} not found.`);
    }
  };

  const handleEditContact = async (editedContact: ContactFormData, contactId: number) => {
    try {
      const response = await fetch(`http://127.0.0.1:8000/contacts/${contactId}/edit/`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(editedContact),
      });
      if (!response.ok) {
        throw new Error('Failed to edit contact');
      }
    } catch (error) {
      console.error('Error editing contact:', error);
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
      console.error('Error deleting contact:', error);
    }
    window.location.reload()
  };

  if (loading) {
    return <CircularProgress />;
  }

  if (error) {
    return <div>Error: {error}</div>;
  }

  const handlePage = (model: GridPaginationModel, details: GridCallbackDetails<any>) => {

    if(previousUrl.current==null && nextUrl.current){
      setUrl(nextUrl.current)
    }

    if (previousUrl.current && nextUrl.current == null){
      setUrl(previousUrl.current)
    }
  };

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
          paginationMode="server"
          onPaginationModelChange={handlePage}
          pageSizeOptions={[10]}
        />
      </div>
    </div>
  );
};

export default ManageSchedules;